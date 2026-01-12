package com.konvert.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.konvert.FormatConverter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ToonUtil {
    
    private static final ObjectMapper jsonMapper = new ObjectMapper();
    
    /**
     * Format TOON with custom delimiter
     */
    public static String formatToon(String toonString, String delimiter) throws Exception {
        if (delimiter == null || delimiter.trim().isEmpty()) {
            delimiter = ",";
        }
        
        // Convert TOON to JSON first (intermediate format)
        String jsonString = FormatConverter.convert(toonString, "toon", "json", null);
        Object obj = jsonMapper.readValue(jsonString, Object.class);
        
        if (obj instanceof Map) {
            return formatToonFromMap((Map<String, Object>) obj, delimiter);
        } else {
            // For non-map objects, convert back to TOON with default delimiter
            return FormatConverter.convert(jsonString, "json", "toon", null);
        }
    }
    
    /**
     * Format Map to TOON with custom delimiter
     */
    private static String formatToonFromMap(Map<String, Object> map, String delimiter) {
        StringBuilder sb = new StringBuilder();
        formatToonRecursive(map, sb, 0, delimiter);
        return sb.toString();
    }
    
    private static void formatToonRecursive(Object obj, StringBuilder sb, int indent, String delimiter) {
        String indentStr = "  ".repeat(indent);
        
        if (obj instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) obj;
            boolean first = true;
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if (!first) {
                    sb.append("\n");
                }
                first = false;
                
                String key = entry.getKey();
                Object value = entry.getValue();
                
                if (value instanceof Map) {
                    sb.append(indentStr).append(key).append(": {\n");
                    formatToonRecursive(value, sb, indent + 1, delimiter);
                    sb.append("\n").append(indentStr).append("}");
                } else if (value instanceof List) {
                    List<?> list = (List<?>) value;
                    if (isUniformArray(list)) {
                        formatUniformArrayToonWithDelimiter(key, list, sb, indentStr, delimiter);
                    } else if (isPrimitiveArray(list)) {
                        sb.append(indentStr);
                        formatPrimitiveArrayToonWithDelimiter(key, list, sb, delimiter);
                    } else {
                        sb.append(indentStr).append(key).append(": [");
                        boolean firstItem = true;
                        for (Object item : list) {
                            if (!firstItem) sb.append(", ");
                            firstItem = false;
                            formatToonRecursive(item, sb, 0, delimiter);
                        }
                        sb.append("]");
                    }
                } else {
                    sb.append(indentStr).append(key).append(": ");
                    appendToonValue(value, sb);
                }
            }
        } else if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            sb.append("[");
            boolean first = true;
            for (Object item : list) {
                if (!first) sb.append(", ");
                first = false;
                formatToonRecursive(item, sb, 0, delimiter);
            }
            sb.append("]");
        } else {
            appendToonValue(obj, sb);
        }
    }
    
    private static boolean isUniformArray(List<?> list) {
        if (list.isEmpty()) return false;
        Object first = list.get(0);
        if (!(first instanceof Map)) return false;
        for (Object item : list) {
            if (!(item instanceof Map)) return false;
            Map<String, ?> itemMap = (Map<String, ?>) item;
            Map<String, ?> firstMap = (Map<String, ?>) first;
            if (!itemMap.keySet().equals(firstMap.keySet())) {
                return false;
            }
        }
        return true;
    }
    
    private static boolean isPrimitiveArray(List<?> list) {
        if (list.isEmpty()) return false;
        for (Object item : list) {
            if (item instanceof Map || item instanceof List) {
                return false;
            }
        }
        return true;
    }
    
    private static void formatUniformArrayToonWithDelimiter(String key, List<?> list, StringBuilder sb, String indentStr, String delimiter) {
        int count = list.size();
        Map<String, ?> firstItem = (Map<String, ?>) list.get(0);
        List<String> fields = new ArrayList<>(firstItem.keySet());
        
        sb.append(indentStr).append(key).append("[").append(count).append("]{");
        boolean firstField = true;
        for (String field : fields) {
            if (!firstField) sb.append(delimiter);
            firstField = false;
            sb.append(field);
        }
        sb.append("}:\n");
        
        for (Object item : list) {
            Map<String, ?> itemMap = (Map<String, ?>) item;
            sb.append(indentStr).append("  ");
            boolean firstValue = true;
            for (String field : fields) {
                if (!firstValue) sb.append(delimiter);
                firstValue = false;
                Object fieldValue = itemMap.get(field);
                appendToonValueInline(fieldValue, sb, delimiter);
            }
            sb.append("\n");
        }
    }
    
    private static void formatPrimitiveArrayToonWithDelimiter(String key, List<?> list, StringBuilder sb, String delimiter) {
        int count = list.size();
        sb.append(key).append("[").append(count).append("]:");
        boolean first = true;
        for (Object item : list) {
            if (!first) sb.append(delimiter);
            first = false;
            sb.append(" ");
            appendToonValueInline(item, sb, delimiter);
        }
    }
    
    private static void appendToonValue(Object value, StringBuilder sb) {
        if (value == null) {
            sb.append("null");
        } else if (value instanceof String) {
            String str = (String) value;
            str = str.replace("\\", "\\\\").replace("\"", "\\\"");
            sb.append("\"").append(str).append("\"");
        } else if (value instanceof Number || value instanceof Boolean) {
            sb.append(value.toString());
        } else {
            sb.append("\"").append(value.toString().replace("\"", "\\\"")).append("\"");
        }
    }
    
    private static void appendToonValueInline(Object value, StringBuilder sb, String delimiter) {
        if (value == null) {
            sb.append("null");
        } else if (value instanceof String) {
            String str = (String) value;
            if (str.contains(delimiter) || str.contains("\n") || str.contains(" ") || str.isEmpty()) {
                str = str.replace("\\", "\\\\").replace("\"", "\\\"");
                sb.append("\"").append(str).append("\"");
            } else {
                sb.append(str);
            }
        } else if (value instanceof Number || value instanceof Boolean) {
            sb.append(value.toString());
        } else {
            sb.append(value.toString());
        }
    }
}

