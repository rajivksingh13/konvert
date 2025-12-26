package com.konvert.util;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;

import java.io.StringReader;
import java.io.StringWriter;
import java.util.*;

public class CsvUtil {
    
    /**
     * Format/beautify CSV with proper alignment and consistent formatting
     */
    public static String formatCsv(String csvString, boolean alignColumns) {
        if (csvString == null || csvString.trim().isEmpty()) {
            throw new IllegalArgumentException("CSV input cannot be empty");
        }
        
        try {
            // Normalize line endings
            String normalized = csvString.trim()
                .replace("\r\n", "\n")
                .replace("\r", "\n");
            
            StringReader reader = new StringReader(normalized);
            CSVParser parser = CSVFormat.DEFAULT.withIgnoreEmptyLines(false).parse(reader);
            
            List<CSVRecord> records = new ArrayList<>();
            for (CSVRecord record : parser) {
                records.add(record);
            }
            
            if (records.isEmpty()) {
                return csvString; // Return original if empty
            }
            
            if (alignColumns) {
                return formatCsvAligned(records);
            } else {
                return formatCsvStandard(records);
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to format CSV: " + e.getMessage(), e);
        }
    }
    
    /**
     * Format CSV with aligned columns for better readability
     */
    private static String formatCsvAligned(List<CSVRecord> records) throws Exception {
        if (records.isEmpty()) {
            return "";
        }
        
        // Find maximum width for each column
        int numColumns = records.get(0).size();
        int[] columnWidths = new int[numColumns];
        
        for (CSVRecord record : records) {
            for (int i = 0; i < Math.min(record.size(), numColumns); i++) {
                String value = record.get(i);
                if (value != null && value.length() > columnWidths[i]) {
                    columnWidths[i] = value.length();
                }
            }
        }
        
        // Build formatted CSV
        StringBuilder result = new StringBuilder();
        for (int rowIndex = 0; rowIndex < records.size(); rowIndex++) {
            CSVRecord record = records.get(rowIndex);
            for (int i = 0; i < numColumns; i++) {
                if (i > 0) {
                    result.append(", ");
                }
                
                String value = i < record.size() ? record.get(i) : "";
                if (value == null) {
                    value = "";
                }
                
                // Pad value to column width
                result.append(padValue(value, columnWidths[i]));
            }
            result.append("\n");
        }
        
        return result.toString().trim();
    }
    
    /**
     * Format CSV with standard formatting (consistent quoting and escaping)
     */
    private static String formatCsvStandard(List<CSVRecord> records) throws Exception {
        StringWriter writer = new StringWriter();
        
        try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT)) {
            for (CSVRecord record : records) {
                List<String> values = new ArrayList<>();
                for (int i = 0; i < record.size(); i++) {
                    values.add(record.get(i));
                }
                printer.printRecord(values);
            }
        }
        
        return writer.toString().trim();
    }
    
    /**
     * Pad value to specified width
     */
    private static String padValue(String value, int width) {
        if (value == null) {
            value = "";
        }
        
        // If value contains comma, quote, or newline, wrap in quotes
        boolean needsQuotes = value.contains(",") || value.contains("\"") || 
                              value.contains("\n") || value.contains("\r");
        
        if (needsQuotes) {
            // Escape quotes
            value = value.replace("\"", "\"\"");
            value = "\"" + value + "\"";
        }
        
        // Pad to width
        if (value.length() < width) {
            value = value + " ".repeat(width - value.length());
        }
        
        return value;
    }
    
    /**
     * Validate CSV structure and return validation results
     */
    public static Map<String, Object> validateCsv(String csvString) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        if (csvString == null || csvString.trim().isEmpty()) {
            errors.add("CSV input is empty");
            result.put("valid", false);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("rowCount", 0);
            result.put("columnCount", 0);
            return result;
        }
        
        try {
            // Normalize line endings
            String normalized = csvString.trim()
                .replace("\r\n", "\n")
                .replace("\r", "\n");
            
            StringReader reader = new StringReader(normalized);
            CSVParser parser = CSVFormat.DEFAULT.withIgnoreEmptyLines(false).parse(reader);
            
            List<CSVRecord> records = new ArrayList<>();
            for (CSVRecord record : parser) {
                records.add(record);
            }
            
            if (records.isEmpty()) {
                warnings.add("CSV contains no data rows");
                result.put("valid", true);
                result.put("errors", errors);
                result.put("warnings", warnings);
                result.put("rowCount", 0);
                result.put("columnCount", 0);
                return result;
            }
            
            // Get header row (first record)
            CSVRecord headerRecord = records.get(0);
            int expectedColumnCount = headerRecord.size();
            Set<String> headerNames = new LinkedHashSet<>();
            
            // Check for duplicate headers
            for (int i = 0; i < headerRecord.size(); i++) {
                String header = headerRecord.get(i);
                if (header == null || header.trim().isEmpty()) {
                    warnings.add("Column " + (i + 1) + " has empty header name");
                } else {
                    if (headerNames.contains(header)) {
                        warnings.add("Duplicate header found: \"" + header + "\"");
                    }
                    headerNames.add(header);
                }
            }
            
            // Validate data rows
            int inconsistentRowCount = 0;
            int emptyRowCount = 0;
            Map<Integer, Integer> inconsistentRows = new LinkedHashMap<>();
            
            for (int i = 1; i < records.size(); i++) {
                CSVRecord record = records.get(i);
                
                // Check for empty rows
                boolean isEmpty = true;
                for (int j = 0; j < record.size(); j++) {
                    String value = record.get(j);
                    if (value != null && !value.trim().isEmpty()) {
                        isEmpty = false;
                        break;
                    }
                }
                
                if (isEmpty) {
                    emptyRowCount++;
                    continue;
                }
                
                // Check column count consistency
                if (record.size() != expectedColumnCount) {
                    inconsistentRowCount++;
                    inconsistentRows.put(i + 1, record.size()); // Row number (1-indexed)
                }
            }
            
            // Build validation result
            if (inconsistentRowCount > 0) {
                errors.add("Found " + inconsistentRowCount + " row(s) with inconsistent column count");
                for (Map.Entry<Integer, Integer> entry : inconsistentRows.entrySet()) {
                    errors.add("Row " + entry.getKey() + " has " + entry.getValue() + 
                              " columns (expected " + expectedColumnCount + ")");
                }
            }
            
            if (emptyRowCount > 0) {
                warnings.add("Found " + emptyRowCount + " empty row(s)");
            }
            
            // Check for special characters that might cause issues
            for (int i = 0; i < records.size(); i++) {
                CSVRecord record = records.get(i);
                for (int j = 0; j < record.size(); j++) {
                    String value = record.get(j);
                    if (value != null) {
                        // Check for unescaped quotes
                        if (value.contains("\"") && !value.startsWith("\"") && !value.endsWith("\"")) {
                            if (i == 0) {
                                warnings.add("Header column " + (j + 1) + " contains unescaped quotes");
                            } else {
                                warnings.add("Row " + (i + 1) + ", column " + (j + 1) + " contains unescaped quotes");
                            }
                        }
                        
                        // Check for newlines in unquoted fields
                        if ((value.contains("\n") || value.contains("\r")) && 
                            !value.startsWith("\"") && !value.endsWith("\"")) {
                            if (i == 0) {
                                warnings.add("Header column " + (j + 1) + " contains newlines (should be quoted)");
                            } else {
                                warnings.add("Row " + (i + 1) + ", column " + (j + 1) + " contains newlines (should be quoted)");
                            }
                        }
                    }
                }
            }
            
            result.put("valid", errors.isEmpty());
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("rowCount", records.size() - 1); // Exclude header
            result.put("columnCount", expectedColumnCount);
            result.put("headerCount", headerNames.size());
            result.put("emptyRowCount", emptyRowCount);
            result.put("inconsistentRowCount", inconsistentRowCount);
            
        } catch (Exception e) {
            errors.add("Failed to parse CSV: " + e.getMessage());
            result.put("valid", false);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("rowCount", 0);
            result.put("columnCount", 0);
        }
        
        return result;
    }
}

