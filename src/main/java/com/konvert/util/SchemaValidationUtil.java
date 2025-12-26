package com.konvert.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.konvert.FormatConverter;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.yaml.snakeyaml.Yaml;

import java.io.StringReader;
import java.util.*;

public class SchemaValidationUtil {
    
    private static final ObjectMapper jsonMapper = new ObjectMapper();
    private static final Yaml yaml = new Yaml();
    
    /**
     * Validate data structure based on format
     */
    public static Map<String, Object> validate(String input, String format) {
        if (input == null || input.trim().isEmpty()) {
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("valid", false);
            result.put("errors", Arrays.asList("Input data is empty"));
            result.put("warnings", new ArrayList<>());
            return result;
        }
        
        if (format == null || format.trim().isEmpty()) {
            format = "json"; // Default to JSON
        }
        
        format = format.toLowerCase();
        
        switch (format) {
            case "csv":
                return validateCsv(input);
            case "json":
                return validateJson(input);
            case "yaml":
            case "yml":
                return validateYaml(input);
            case "xml":
                return validateXml(input);
            case "toml":
                return validateToml(input);
            case "properties":
                return validateProperties(input);
            default:
                Map<String, Object> result = new LinkedHashMap<>();
                result.put("valid", false);
                result.put("errors", Arrays.asList("Unsupported format: " + format));
                result.put("warnings", new ArrayList<>());
                return result;
        }
    }
    
    /**
     * Validate CSV structure
     */
    private static Map<String, Object> validateCsv(String csvString) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
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
                result.put("format", "csv");
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
            result.put("format", "csv");
            
        } catch (Exception e) {
            errors.add("Failed to parse CSV: " + e.getMessage());
            result.put("valid", false);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("rowCount", 0);
            result.put("columnCount", 0);
            result.put("format", "csv");
        }
        
        return result;
    }
    
    /**
     * Validate JSON structure
     */
    private static Map<String, Object> validateJson(String jsonString) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        try {
            Object parsed = jsonMapper.readValue(jsonString, Object.class);
            
            // Additional JSON-specific validations
            if (parsed == null) {
                warnings.add("JSON is null");
            }
            
            // Count structure elements
            int elementCount = countJsonElements(parsed);
            String structureType = getJsonStructureType(parsed);
            
            result.put("valid", true);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("elementCount", elementCount);
            result.put("structureType", structureType);
            result.put("format", "json");
            
        } catch (Exception e) {
            errors.add("Invalid JSON syntax: " + e.getMessage());
            result.put("valid", false);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("format", "json");
        }
        
        return result;
    }
    
    /**
     * Validate YAML structure
     */
    private static Map<String, Object> validateYaml(String yamlString) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        try {
            Object parsed = yaml.load(yamlString);
            
            if (parsed == null) {
                warnings.add("YAML is null or empty");
            }
            
            // Count structure elements
            int elementCount = countYamlElements(parsed);
            String structureType = getYamlStructureType(parsed);
            
            result.put("valid", true);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("elementCount", elementCount);
            result.put("structureType", structureType);
            result.put("format", "yaml");
            
        } catch (Exception e) {
            errors.add("Invalid YAML syntax: " + e.getMessage());
            result.put("valid", false);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("format", "yaml");
        }
        
        return result;
    }
    
    /**
     * Validate XML structure
     */
    private static Map<String, Object> validateXml(String xmlString) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        try {
            // Try to parse XML - use a simple validation approach
            if (!xmlString.trim().startsWith("<") || !xmlString.trim().contains(">")) {
                throw new IllegalArgumentException("Invalid XML structure");
            }
            
            // Try conversion to validate structure
            try {
                FormatConverter.convert(xmlString, "xml", "json", null);
            } catch (Exception e) {
                throw new IllegalArgumentException("XML parsing failed: " + e.getMessage());
            }
            
            // If conversion succeeds, XML is valid
            result.put("valid", true);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("format", "xml");
            
        } catch (Exception e) {
            errors.add("Invalid XML syntax: " + e.getMessage());
            result.put("valid", false);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("format", "xml");
        }
        
        return result;
    }
    
    /**
     * Validate TOML structure
     */
    private static Map<String, Object> validateToml(String tomlString) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        try {
            // Try to parse TOML - validate structure
            try {
                FormatConverter.convert(tomlString, "toml", "json", null);
            } catch (Exception e) {
                throw new IllegalArgumentException("TOML parsing failed: " + e.getMessage());
            }
            
            result.put("valid", true);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("format", "toml");
            
        } catch (Exception e) {
            errors.add("Invalid TOML syntax: " + e.getMessage());
            result.put("valid", false);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("format", "toml");
        }
        
        return result;
    }
    
    /**
     * Validate Properties structure
     */
    private static Map<String, Object> validateProperties(String propertiesString) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        try {
            // Try to parse Properties - validate structure
            Object parsed;
            try {
                parsed = FormatConverter.convert(propertiesString, "properties", "json", null);
            } catch (Exception e) {
                throw new IllegalArgumentException("Properties parsing failed: " + e.getMessage());
            }
            
            int propertyCount = 0;
            if (parsed instanceof Map) {
                propertyCount = ((Map<?, ?>) parsed).size();
            }
            
            result.put("valid", true);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("propertyCount", propertyCount);
            result.put("format", "properties");
            
        } catch (Exception e) {
            errors.add("Invalid Properties syntax: " + e.getMessage());
            result.put("valid", false);
            result.put("errors", errors);
            result.put("warnings", warnings);
            result.put("format", "properties");
        }
        
        return result;
    }
    
    // Helper methods for JSON
    private static int countJsonElements(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Map) {
            int count = ((Map<?, ?>) obj).size();
            for (Object value : ((Map<?, ?>) obj).values()) {
                count += countJsonElements(value);
            }
            return count;
        } else if (obj instanceof List) {
            int count = ((List<?>) obj).size();
            for (Object item : (List<?>) obj) {
                count += countJsonElements(item);
            }
            return count;
        }
        return 1;
    }
    
    private static String getJsonStructureType(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof Map) return "object";
        if (obj instanceof List) return "array";
        if (obj instanceof String) return "string";
        if (obj instanceof Number) return "number";
        if (obj instanceof Boolean) return "boolean";
        return obj.getClass().getSimpleName().toLowerCase();
    }
    
    // Helper methods for YAML
    private static int countYamlElements(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Map) {
            int count = ((Map<?, ?>) obj).size();
            for (Object value : ((Map<?, ?>) obj).values()) {
                count += countYamlElements(value);
            }
            return count;
        } else if (obj instanceof List) {
            int count = ((List<?>) obj).size();
            for (Object item : (List<?>) obj) {
                count += countYamlElements(item);
            }
            return count;
        }
        return 1;
    }
    
    private static String getYamlStructureType(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof Map) return "mapping";
        if (obj instanceof List) return "sequence";
        if (obj instanceof String) return "string";
        if (obj instanceof Number) return "number";
        if (obj instanceof Boolean) return "boolean";
        return obj.getClass().getSimpleName().toLowerCase();
    }
}

