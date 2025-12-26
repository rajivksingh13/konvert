package com.konvert.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.konvert.FormatConverter;
import org.yaml.snakeyaml.Yaml;

import java.util.*;

public class DiffUtil {
    
    private static final ObjectMapper jsonMapper = new ObjectMapper();
    private static final Yaml yaml = new Yaml();
    
    /**
     * Compare two data structures and generate diff report
     */
    public static Map<String, Object> compare(String input1, String input2, String format) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> differences = new ArrayList<>();
        
        if (input1 == null || input1.trim().isEmpty()) {
            result.put("success", false);
            result.put("error", "First input cannot be empty");
            return result;
        }
        
        if (input2 == null || input2.trim().isEmpty()) {
            result.put("success", false);
            result.put("error", "Second input cannot be empty");
            return result;
        }
        
        if (format == null || format.trim().isEmpty()) {
            format = "json";
        }
        
        format = format.toLowerCase();
        
        try {
            Object obj1 = parseInput(input1, format);
            Object obj2 = parseInput(input2, format);
            
            // Compare objects
            compareObjects(obj1, obj2, "", differences);
            
            result.put("success", true);
            result.put("format", format);
            result.put("identical", differences.isEmpty());
            result.put("differences", differences);
            result.put("differenceCount", differences.size());
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Comparison failed: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Parse input based on format
     */
    private static Object parseInput(String input, String format) throws Exception {
        // Clean input - remove non-breaking spaces and other problematic characters
        input = cleanInput(input);
        
        switch (format) {
            case "json":
                return jsonMapper.readValue(input, Object.class);
            case "yaml":
            case "yml":
                return yaml.load(input);
            case "xml":
                // Convert XML to JSON for comparison
                String json = FormatConverter.convert(input, "xml", "json", null);
                return jsonMapper.readValue(json, Object.class);
            default:
                throw new IllegalArgumentException("Unsupported format for comparison: " + format);
        }
    }
    
    /**
     * Clean input text - remove non-breaking spaces and other invisible characters
     */
    private static String cleanInput(String input) {
        if (input == null) {
            return null;
        }
        
        // Replace non-breaking spaces (U+00A0) with regular spaces
        input = input.replace('\u00A0', ' ');
        
        // Replace other common invisible/zero-width characters
        input = input.replace("\u200B", ""); // Zero-width space
        input = input.replace("\u200C", ""); // Zero-width non-joiner
        input = input.replace("\u200D", ""); // Zero-width joiner
        input = input.replace("\uFEFF", ""); // Zero-width no-break space (BOM)
        
        // Remove BOM if present
        if (input.startsWith("\uFEFF")) {
            input = input.substring(1);
        }
        
        return input.trim();
    }
    
    /**
     * Compare two objects recursively
     */
    @SuppressWarnings("unchecked")
    private static void compareObjects(Object obj1, Object obj2, String path, List<Map<String, Object>> differences) {
        // Both null - identical
        if (obj1 == null && obj2 == null) {
            return;
        }
        
        // One is null - different
        if (obj1 == null || obj2 == null) {
            addDifference(differences, path, obj1, obj2, "value_missing");
            return;
        }
        
        // Different types
        if (!obj1.getClass().equals(obj2.getClass())) {
            addDifference(differences, path, obj1, obj2, "type_mismatch");
            return;
        }
        
        // Compare based on type
        if (obj1 instanceof Map) {
            compareMaps((Map<String, Object>) obj1, (Map<String, Object>) obj2, path, differences);
        } else if (obj1 instanceof List) {
            compareLists((List<Object>) obj1, (List<Object>) obj2, path, differences);
        } else {
            // Primitive values
            if (!obj1.equals(obj2)) {
                addDifference(differences, path, obj1, obj2, "value_changed");
            }
        }
    }
    
    /**
     * Compare two maps
     */
    private static void compareMaps(Map<String, Object> map1, Map<String, Object> map2, 
                                   String path, List<Map<String, Object>> differences) {
        Set<String> allKeys = new HashSet<>();
        allKeys.addAll(map1.keySet());
        allKeys.addAll(map2.keySet());
        
        for (String key : allKeys) {
            String newPath = path.isEmpty() ? key : path + "." + key;
            Object val1 = map1.get(key);
            Object val2 = map2.get(key);
            
            if (!map1.containsKey(key)) {
                addDifference(differences, newPath, null, val2, "added");
            } else if (!map2.containsKey(key)) {
                addDifference(differences, newPath, val1, null, "removed");
            } else {
                compareObjects(val1, val2, newPath, differences);
            }
        }
    }
    
    /**
     * Compare two lists
     */
    private static void compareLists(List<Object> list1, List<Object> list2, 
                                     String path, List<Map<String, Object>> differences) {
        int maxSize = Math.max(list1.size(), list2.size());
        
        for (int i = 0; i < maxSize; i++) {
            String newPath = path + "[" + i + "]";
            
            if (i >= list1.size()) {
                addDifference(differences, newPath, null, list2.get(i), "added");
            } else if (i >= list2.size()) {
                addDifference(differences, newPath, list1.get(i), null, "removed");
            } else {
                compareObjects(list1.get(i), list2.get(i), newPath, differences);
            }
        }
    }
    
    /**
     * Add a difference to the list
     */
    private static void addDifference(List<Map<String, Object>> differences, String path, 
                                     Object value1, Object value2, String type) {
        Map<String, Object> diff = new LinkedHashMap<>();
        diff.put("path", path);
        diff.put("type", type);
        diff.put("value1", value1);
        diff.put("value2", value2);
        diff.put("description", getDifferenceDescription(type, path, value1, value2));
        differences.add(diff);
    }
    
    /**
     * Get human-readable difference description
     */
    private static String getDifferenceDescription(String type, String path, Object value1, Object value2) {
        switch (type) {
            case "added":
                return "Added: " + formatValue(value2);
            case "removed":
                return "Removed: " + formatValue(value1);
            case "value_changed":
                return "Changed from " + formatValue(value1) + " to " + formatValue(value2);
            case "value_missing":
                return "Missing value (was " + formatValue(value1 != null ? value1 : value2) + ")";
            case "type_mismatch":
                return "Type mismatch: " + (value1 != null ? value1.getClass().getSimpleName() : "null") + 
                       " vs " + (value2 != null ? value2.getClass().getSimpleName() : "null");
            default:
                return "Difference at " + path;
        }
    }
    
    /**
     * Format value for display
     */
    private static String formatValue(Object value) {
        if (value == null) {
            return "null";
        }
        if (value instanceof String) {
            String str = (String) value;
            if (str.length() > 50) {
                return "\"" + str.substring(0, 47) + "...\"";
            }
            return "\"" + str + "\"";
        }
        if (value instanceof Map || value instanceof List) {
            return value.getClass().getSimpleName();
        }
        return String.valueOf(value);
    }
    
    /**
     * Generate formatted diff report
     */
    public static String generateDiffReport(Map<String, Object> comparisonResult) {
        if (!Boolean.TRUE.equals(comparisonResult.get("success"))) {
            return "Error: " + comparisonResult.get("error");
        }
        
        StringBuilder report = new StringBuilder();
        report.append("=== Diff Report ===\n\n");
        report.append("Format: ").append(comparisonResult.get("format")).append("\n");
        report.append("Status: ").append(Boolean.TRUE.equals(comparisonResult.get("identical")) ? 
                                         "IDENTICAL" : "DIFFERENT").append("\n");
        report.append("Differences Found: ").append(comparisonResult.get("differenceCount")).append("\n\n");
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> differences = (List<Map<String, Object>>) comparisonResult.get("differences");
        
        if (differences == null || differences.isEmpty()) {
            report.append("✅ Files are identical. No differences found.\n");
        } else {
            report.append("=== Differences ===\n\n");
            for (int i = 0; i < differences.size(); i++) {
                Map<String, Object> diff = differences.get(i);
                report.append(i + 1).append(". ").append(diff.get("path")).append("\n");
                report.append("   Type: ").append(diff.get("type")).append("\n");
                report.append("   ").append(diff.get("description")).append("\n");
                if (diff.get("value1") != null) {
                    report.append("   Left:  ").append(formatValueForReport(diff.get("value1"))).append("\n");
                }
                if (diff.get("value2") != null) {
                    report.append("   Right: ").append(formatValueForReport(diff.get("value2"))).append("\n");
                }
                report.append("\n");
            }
        }
        
        return report.toString();
    }
    
    /**
     * Format value for report
     */
    private static String formatValueForReport(Object value) {
        if (value == null) {
            return "null";
        }
        try {
            if (value instanceof Map || value instanceof List) {
                return jsonMapper.writerWithDefaultPrettyPrinter().writeValueAsString(value);
            }
            return String.valueOf(value);
        } catch (Exception e) {
            return String.valueOf(value);
        }
    }
}

