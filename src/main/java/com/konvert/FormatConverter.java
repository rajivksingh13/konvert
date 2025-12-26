package com.konvert;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import com.google.protobuf.util.JsonFormat;
import java.util.Base64;
import com.moandjiezana.toml.Toml;
import org.yaml.snakeyaml.Yaml;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.csv.CSVPrinter;

import java.io.StringReader;
import java.io.StringWriter;
import java.util.*;

public class FormatConverter {
    
    private static final ObjectMapper jsonMapper = new ObjectMapper();
    private static final YAMLMapper yamlMapper = new YAMLMapper();
    private static final XmlMapper xmlMapper = new XmlMapper();
    private static final Yaml yaml = new Yaml();
    
    public static String convert(String input, String fromFormat, String toFormat, String protobufSchema) 
            throws Exception {
        
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        
        // Validate format strings
        if (fromFormat == null || toFormat == null) {
            throw new IllegalArgumentException("From and to formats must be specified");
        }
        
        try {
            // Convert to intermediate object
            Object intermediate = parseInput(input, fromFormat, protobufSchema);
            
            // Convert from intermediate to target format
            return formatOutput(intermediate, toFormat, protobufSchema);
        } catch (Exception e) {
            // Provide more helpful error messages
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("Unrecognized token")) {
                throw new IllegalArgumentException(
                    "Failed to parse " + fromFormat.toUpperCase() + " input. " +
                    "Please ensure you selected the correct source format and that your input data is valid " + fromFormat.toUpperCase() + ". " +
                    "Original error: " + errorMsg
                );
            }
            throw e;
        }
    }
    
    private static Object parseInput(String input, String format, String protobufSchema) throws Exception {
        switch (format.toLowerCase()) {
            case "json":
                return jsonMapper.readValue(input, Object.class);
                
            case "yaml":
                return yaml.load(input);
                
            case "toml":
                Toml toml = new Toml().read(input);
                return tomlToMap(toml);
                
            case "xml":
                return xmlToObject(input);
                
            case "properties":
                return propertiesToMap(input);
                
            case "protobuf":
                if (protobufSchema == null || protobufSchema.trim().isEmpty()) {
                    throw new IllegalArgumentException("Protobuf schema is required");
                }
                return protobufToObject(input, protobufSchema);
                
            case "csv":
                return csvToMap(input);
                
            default:
                throw new IllegalArgumentException("Unsupported input format: " + format);
        }
    }
    
    private static String formatOutput(Object data, String format, String protobufSchema) throws Exception {
        switch (format.toLowerCase()) {
            case "json":
                return jsonMapper.writerWithDefaultPrettyPrinter().writeValueAsString(data);
                
            case "yaml":
                return yamlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(data);
                
            case "toml":
                // TOML conversion expects a Map, but CSV returns a List
                if (data instanceof List) {
                    // Convert list to a map with a "rows" key
                    Map<String, Object> wrapper = new LinkedHashMap<>();
                    wrapper.put("rows", data);
                    return mapToToml(wrapper);
                }
                return mapToToml((Map<String, Object>) data);
                
            case "xml":
                return objectToXml(data);
                
            case "protobuf":
                if (protobufSchema == null || protobufSchema.trim().isEmpty()) {
                    throw new IllegalArgumentException("Protobuf schema is required");
                }
                return objectToProtobuf(data, protobufSchema);
                
            case "csv":
                return mapToCsv(data);
                
            default:
                throw new IllegalArgumentException("Unsupported output format: " + format);
        }
    }
    
    // Properties to Map
    private static Map<String, Object> propertiesToMap(String propertiesString) {
        Map<String, Object> result = new LinkedHashMap<>();
        Properties props = new Properties();
        
        try {
            props.load(new StringReader(propertiesString));
            
            for (String key : props.stringPropertyNames()) {
                String value = props.getProperty(key);
                
                // Handle nested keys (e.g., "database.host" -> {database: {host: value}})
                String[] keys = key.split("\\.");
                Map<String, Object> current = result;
                
                for (int i = 0; i < keys.length - 1; i++) {
                    current = (Map<String, Object>) current.computeIfAbsent(keys[i], k -> new LinkedHashMap<>());
                }
                
                current.put(keys[keys.length - 1], value);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse properties: " + e.getMessage(), e);
        }
        
        return result;
    }
    
    // TOML to Map
    private static Map<String, Object> tomlToMap(Toml toml) {
        Map<String, Object> tomlMap = toml.toMap();
        Map<String, Object> result = new LinkedHashMap<>();
        
        for (Map.Entry<String, Object> entry : tomlMap.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            
            // Handle nested tables - check if value is a Map
            if (value instanceof Map) {
                // For nested tables, recursively process
                result.put(key, processNestedMap((Map<String, Object>) value));
            } else {
                result.put(key, value);
            }
        }
        
        return result;
    }
    
    // Helper method to process nested maps from TOML
    private static Map<String, Object> processNestedMap(Map<String, Object> map) {
        Map<String, Object> result = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            Object value = entry.getValue();
            if (value instanceof Map) {
                result.put(entry.getKey(), processNestedMap((Map<String, Object>) value));
            } else {
                result.put(entry.getKey(), value);
            }
        }
        return result;
    }
    
    // Map to TOML
    private static String mapToToml(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder();
        mapToTomlRecursive(map, sb, "");
        return sb.toString();
    }
    
    private static void mapToTomlRecursive(Map<String, Object> map, StringBuilder sb, String prefix) {
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            String key = prefix.isEmpty() ? entry.getKey() : prefix + "." + entry.getKey();
            Object value = entry.getValue();
            
            if (value instanceof Map) {
                sb.append("\n[").append(key).append("]\n");
                mapToTomlRecursive((Map<String, Object>) value, sb, key);
            } else if (value instanceof List) {
                sb.append(key).append(" = ").append(formatTomlValue(value)).append("\n");
            } else {
                sb.append(key).append(" = ").append(formatTomlValue(value)).append("\n");
            }
        }
    }
    
    private static String formatTomlValue(Object value) {
        if (value == null) {
            return "null";
        } else if (value instanceof String) {
            String str = (String) value;
            // Escape quotes and newlines
            str = str.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
            return "\"" + str + "\"";
        } else if (value instanceof Number || value instanceof Boolean) {
            return String.valueOf(value);
        } else if (value instanceof List) {
            List<?> list = (List<?>) value;
            if (list.isEmpty()) {
                return "[]";
            }
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(", ");
                sb.append(formatTomlValue(list.get(i)));
            }
            sb.append("]");
            return sb.toString();
        } else {
            return "\"" + value.toString().replace("\"", "\\\"") + "\"";
        }
    }
    
    // Protobuf conversion (simplified - requires schema)
    private static Object protobufToObject(String protobufBase64, String schema) throws Exception {
        // Note: This is a simplified implementation
        // For production, you'd need to compile .proto files and generate Java classes
        // This example shows the concept but would need proper schema compilation
        
        byte[] bytes = Base64.getDecoder().decode(protobufBase64);
        
        // Parse JSON representation (requires proper protobuf message type)
        // This is a placeholder - actual implementation would use generated classes
        throw new UnsupportedOperationException(
            "Protobuf conversion requires compiled .proto schema files. " +
            "Please use protoc to generate Java classes from your .proto file."
        );
    }
    
    private static String objectToProtobuf(Object data, String schema) throws Exception {
        // Note: This is a simplified implementation
        // For production, you'd need to compile .proto files and generate Java classes
        
        // Convert object to JSON first
        String json = jsonMapper.writeValueAsString(data);
        
        // Parse JSON to Protobuf (requires proper protobuf message type)
        // This is a placeholder - actual implementation would use generated classes
        throw new UnsupportedOperationException(
            "Protobuf conversion requires compiled .proto schema files. " +
            "Please use protoc to generate Java classes from your .proto file."
        );
    }
    
    // CSV to Map (List of Maps, where each map represents a row)
    private static Object csvToMap(String csvString) throws Exception {
        if (csvString == null || csvString.trim().isEmpty()) {
            throw new IllegalArgumentException("CSV input cannot be empty");
        }
        
        // Normalize line endings and ensure proper CSV format
        String normalized = csvString.trim()
            .replace("\r\n", "\n")  // Windows line endings
            .replace("\r", "\n");   // Old Mac line endings
        
        // If there are no newlines but there are commas, try to detect if it's space-separated
        // and convert spaces to newlines (for cases where user pasted without line breaks)
        if (!normalized.contains("\n") && normalized.contains(",")) {
            // Check if it looks like multiple rows on one line (has multiple comma-separated groups)
            String[] parts = normalized.split("\\s{2,}"); // Split on 2+ spaces
            if (parts.length > 1) {
                // Likely multiple rows separated by spaces
                normalized = String.join("\n", parts);
            }
        }
        
        try {
            StringReader reader = new StringReader(normalized);
            CSVParser parser = CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreEmptyLines().parse(reader);
            
            List<Map<String, String>> rows = new ArrayList<>();
            List<String> headers = parser.getHeaderNames();
            
            if (headers == null || headers.isEmpty()) {
                throw new IllegalArgumentException("CSV must have a header row. Please ensure your CSV has a header row with column names.");
            }
            
            for (CSVRecord record : parser) {
                Map<String, String> row = new LinkedHashMap<>();
                for (String header : headers) {
                    String value = record.get(header);
                    row.put(header, value != null ? value : "");
                }
                rows.add(row);
            }
            
            // Always return as list for consistency, even if single row
            // This makes conversion to other formats more predictable
            if (rows.isEmpty()) {
                // Empty CSV with headers - return structure with headers only
                Map<String, String> emptyRow = new LinkedHashMap<>();
                for (String header : headers) {
                    emptyRow.put(header, "");
                }
                return Collections.singletonList(emptyRow);
            }
            
            return rows;
        } catch (IllegalArgumentException e) {
            // If parsing with headers fails, try without headers
            try {
                StringReader reader = new StringReader(normalized);
                CSVParser parser = CSVFormat.DEFAULT.withIgnoreEmptyLines().parse(reader);
                
                List<Map<String, String>> rows = new ArrayList<>();
                List<String> headers = null;
                boolean firstRow = true;
                
                for (CSVRecord record : parser) {
                    if (firstRow) {
                        // First row as headers
                        headers = new ArrayList<>();
                        for (int i = 0; i < record.size(); i++) {
                            headers.add("Column" + (i + 1));
                        }
                        firstRow = false;
                        continue; // Skip first row as it's headers
                    }
                    
                    Map<String, String> row = new LinkedHashMap<>();
                    for (int i = 0; i < headers.size() && i < record.size(); i++) {
                        String value = record.get(i);
                        row.put(headers.get(i), value != null ? value : "");
                    }
                    rows.add(row);
                }
                
                if (rows.isEmpty() && headers != null) {
                    // Empty CSV - return structure with headers only
                    Map<String, String> emptyRow = new LinkedHashMap<>();
                    for (String header : headers) {
                        emptyRow.put(header, "");
                    }
                    return Collections.singletonList(emptyRow);
                }
                
                return rows;
            } catch (Exception e2) {
                throw new RuntimeException("Failed to parse CSV. Please ensure your CSV has proper line breaks between rows. Error: " + e2.getMessage(), e2);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV. Please ensure your CSV format is correct with proper line breaks. Error: " + e.getMessage(), e);
        }
    }
    
    // Map/List to CSV
    private static String mapToCsv(Object data) throws Exception {
        StringWriter writer = new StringWriter();
        
        try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT)) {
            if (data instanceof List) {
                List<?> list = (List<?>) data;
                if (list.isEmpty()) {
                    return "";
                }
                
                // Get headers from first item
                Object firstItem = list.get(0);
                if (firstItem instanceof Map) {
                    Map<String, ?> firstMap = (Map<String, ?>) firstItem;
                    List<String> headers = new ArrayList<>(firstMap.keySet());
                    
                    // Write header
                    printer.printRecord(headers);
                    
                    // Write all rows
                    for (Object item : list) {
                        if (item instanceof Map) {
                            Map<String, ?> row = (Map<String, ?>) item;
                            List<Object> values = new ArrayList<>();
                            for (String header : headers) {
                                Object value = row.get(header);
                                values.add(value != null ? value.toString() : "");
                            }
                            printer.printRecord(values);
                        }
                    }
                } else {
                    // Simple list of values
                    for (Object item : list) {
                        printer.printRecord(item);
                    }
                }
            } else if (data instanceof Map) {
                Map<String, ?> map = (Map<String, ?>) data;
                List<String> headers = new ArrayList<>(map.keySet());
                
                // Write header
                printer.printRecord(headers);
                
                // Write row
                List<Object> values = new ArrayList<>();
                for (String header : headers) {
                    Object value = map.get(header);
                    values.add(value != null ? value.toString() : "");
                }
                printer.printRecord(values);
            } else {
                // Single value
                printer.printRecord(data);
            }
            
            printer.flush();
            return writer.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert to CSV: " + e.getMessage(), e);
        }
    }
    
    // Parse XML to object (handles both our custom format and standard XML)
    private static Object xmlToObject(String xmlString) throws Exception {
        try {
            // Try parsing with Jackson first (for standard XML)
            Object result = xmlMapper.readValue(xmlString, Object.class);
            
            // Normalize the structure to extract the actual data
            return normalizeXmlStructure(result);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse XML: " + e.getMessage(), e);
        }
    }
    
    // Normalize XML structure to extract records/rows for CSV conversion
    private static Object normalizeXmlStructure(Object obj) {
        if (obj instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) obj;
            
            // Handle our custom format: <data><record>...</record></data>
            if (map.containsKey("data")) {
                Object data = map.get("data");
                if (data instanceof Map) {
                    Map<String, Object> dataMap = (Map<String, Object>) data;
                    // Check for "record" array
                    if (dataMap.containsKey("record")) {
                        Object record = dataMap.get("record");
                        if (record instanceof List) {
                            return record; // List of records
                        } else if (record instanceof Map) {
                            return Collections.singletonList(record); // Single record
                        }
                    }
                    // If data is a single record map, return it as a list
                    if (!dataMap.isEmpty() && !dataMap.containsKey("record")) {
                        return Collections.singletonList(dataMap);
                    }
                    return dataMap;
                } else if (data instanceof List) {
                    return data;
                }
            }
            
            // Handle case where root has "record" directly
            if (map.containsKey("record")) {
                Object record = map.get("record");
                if (record instanceof List) {
                    return record;
                } else if (record instanceof Map) {
                    return Collections.singletonList(record);
                }
            }
            
            // Handle standard XML: if root has a single child that's a map or list
            if (map.size() == 1) {
                Object firstValue = map.values().iterator().next();
                if (firstValue instanceof Map) {
                    Map<String, Object> childMap = (Map<String, Object>) firstValue;
                    // If it looks like a record (has multiple fields), return as list
                    if (childMap.size() > 1) {
                        return Collections.singletonList(childMap);
                    }
                    return childMap;
                } else if (firstValue instanceof List) {
                    return firstValue;
                }
            }
            
            // If map has multiple entries that look like records, collect them
            List<Map<String, Object>> records = new ArrayList<>();
            boolean allAreMaps = true;
            for (Object value : map.values()) {
                if (value instanceof Map) {
                    records.add((Map<String, Object>) value);
                } else {
                    allAreMaps = false;
                    break;
                }
            }
            
            if (allAreMaps && !records.isEmpty()) {
                return records;
            }
            
            // Default: return the map as-is
            return map;
        } else if (obj instanceof List) {
            return obj;
        }
        
        return obj;
    }
    
    // Convert object to clean XML format
    private static String objectToXml(Object data) throws Exception {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        
        if (data instanceof List) {
            List<?> list = (List<?>) data;
            xml.append("<data>\n");
            
            for (Object item : list) {
                if (item instanceof Map) {
                    xml.append("  <record>\n");
                    Map<String, ?> map = (Map<String, ?>) item;
                    for (Map.Entry<String, ?> entry : map.entrySet()) {
                        String key = sanitizeXmlName(entry.getKey());
                        Object value = entry.getValue();
                        xml.append("    <").append(key).append(">");
                        xml.append(escapeXml(value != null ? value.toString() : ""));
                        xml.append("</").append(key).append(">\n");
                    }
                    xml.append("  </record>\n");
                } else {
                    xml.append("  <item>");
                    xml.append(escapeXml(item != null ? item.toString() : ""));
                    xml.append("</item>\n");
                }
            }
            
            xml.append("</data>");
        } else if (data instanceof Map) {
            Map<String, ?> map = (Map<String, ?>) data;
            xml.append("<data>\n");
            xml.append("  <record>\n");
            
            for (Map.Entry<String, ?> entry : map.entrySet()) {
                String key = sanitizeXmlName(entry.getKey());
                Object value = entry.getValue();
                xml.append("    <").append(key).append(">");
                xml.append(escapeXml(value != null ? value.toString() : ""));
                xml.append("</").append(key).append(">\n");
            }
            
            xml.append("  </record>\n");
            xml.append("</data>");
        } else {
            xml.append("<data>");
            xml.append(escapeXml(data != null ? data.toString() : ""));
            xml.append("</data>");
        }
        
        return xml.toString();
    }
    
    // Sanitize XML element names (remove invalid characters)
    private static String sanitizeXmlName(String name) {
        if (name == null || name.isEmpty()) {
            return "item";
        }
        // Replace invalid XML name characters
        String sanitized = name.replaceAll("[^a-zA-Z0-9_\\-]", "_");
        // Ensure it starts with a letter or underscore
        if (!sanitized.matches("^[a-zA-Z_].*")) {
            sanitized = "item_" + sanitized;
        }
        return sanitized;
    }
    
    // Escape XML special characters
    private static String escapeXml(String text) {
        if (text == null) {
            return "";
        }
        return text
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&apos;");
    }
}

