package com.konvert.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.*;
import com.konvert.FormatConverter;

import java.util.*;
import java.util.regex.Pattern;

public class DataTransformUtil {
    
    private static final ObjectMapper mapper = new ObjectMapper();
    
    /**
     * Merge multiple JSON objects
     */
    public static String mergeJson(String... jsonStrings) {
        if (jsonStrings == null || jsonStrings.length == 0) {
            throw new IllegalArgumentException("At least one JSON string is required");
        }
        
        try {
            ObjectNode merged = mapper.createObjectNode();
            
            for (String jsonStr : jsonStrings) {
                if (jsonStr == null || jsonStr.trim().isEmpty()) {
                    continue;
                }
                
                JsonNode node = mapper.readTree(jsonStr);
                if (node.isObject()) {
                    mergeNodes(merged, (ObjectNode) node);
                } else if (node.isArray()) {
                    // If first item, create array; otherwise append
                    if (!merged.has("items")) {
                        merged.set("items", mapper.createArrayNode());
                    }
                    ArrayNode items = (ArrayNode) merged.get("items");
                    items.add(node);
                }
            }
            
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(merged);
        } catch (Exception e) {
            throw new RuntimeException("JSON merge failed: " + e.getMessage(), e);
        }
    }
    
    private static void mergeNodes(ObjectNode target, ObjectNode source) {
        Iterator<Map.Entry<String, JsonNode>> fields = source.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> entry = fields.next();
            String key = entry.getKey();
            JsonNode value = entry.getValue();
            
            if (target.has(key) && target.get(key).isObject() && value.isObject()) {
                // Recursively merge nested objects
                mergeNodes((ObjectNode) target.get(key), (ObjectNode) value);
            } else {
                // Overwrite or add new field
                target.set(key, value);
            }
        }
    }
    
    /**
     * Flatten nested structure (supports JSON, YAML, XML, etc.)
     */
    public static String flattenData(String input, String inputFormat, String outputFormat, String separator) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        
        if (separator == null || separator.isEmpty()) {
            separator = ".";
        }
        
        if (inputFormat == null || inputFormat.trim().isEmpty()) {
            inputFormat = "json";
        }
        
        if (outputFormat == null || outputFormat.trim().isEmpty()) {
            outputFormat = "json";
        }
        
        try {
            // Convert input to JSON first (intermediate format)
            String jsonString;
            if (!"json".equalsIgnoreCase(inputFormat)) {
                jsonString = FormatConverter.convert(input, inputFormat, "json", null);
            } else {
                jsonString = input;
            }
            
            // Flatten the JSON structure
            JsonNode root = mapper.readTree(jsonString);
            Map<String, Object> flattened = new LinkedHashMap<>();
            
            if (root.isObject()) {
                flattenObject("", (ObjectNode) root, flattened, separator);
            } else if (root.isArray()) {
                flattenArray("", (ArrayNode) root, flattened, separator);
            } else {
                flattened.put("value", root.asText());
            }
            
            String flattenedJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(flattened);
            
            // Convert to output format if needed
            if (!"json".equalsIgnoreCase(outputFormat)) {
                return FormatConverter.convert(flattenedJson, "json", outputFormat, null);
            }
            
            return flattenedJson;
        } catch (Exception e) {
            throw new RuntimeException("Data flattening failed: " + e.getMessage(), e);
        }
    }
    
    private static void flattenObject(String prefix, ObjectNode node, Map<String, Object> result, String separator) {
        Iterator<Map.Entry<String, JsonNode>> fields = node.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> entry = fields.next();
            String key = entry.getKey();
            JsonNode value = entry.getValue();
            String newKey = prefix.isEmpty() ? key : prefix + separator + key;
            
            if (value.isObject()) {
                flattenObject(newKey, (ObjectNode) value, result, separator);
            } else if (value.isArray()) {
                flattenArray(newKey, (ArrayNode) value, result, separator);
            } else {
                result.put(newKey, getValue(value));
            }
        }
    }
    
    private static void flattenArray(String prefix, ArrayNode array, Map<String, Object> result, String separator) {
        for (int i = 0; i < array.size(); i++) {
            JsonNode item = array.get(i);
            String newKey = prefix + "[" + i + "]";
            
            if (item.isObject()) {
                flattenObject(newKey, (ObjectNode) item, result, separator);
            } else if (item.isArray()) {
                flattenArray(newKey, (ArrayNode) item, result, separator);
            } else {
                result.put(newKey, getValue(item));
            }
        }
    }
    
    private static Object getValue(JsonNode node) {
        if (node.isTextual()) return node.asText();
        if (node.isNumber()) return node.isInt() ? node.asInt() : node.asDouble();
        if (node.isBoolean()) return node.asBoolean();
        if (node.isNull()) return null;
        return node.asText();
    }
    
    /**
     * Unflatten structure (supports JSON, YAML, XML, etc.)
     */
    public static String unflattenData(String input, String inputFormat, String outputFormat, String separator) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        
        if (separator == null || separator.isEmpty()) {
            separator = ".";
        }
        
        if (inputFormat == null || inputFormat.trim().isEmpty()) {
            inputFormat = "json";
        }
        
        if (outputFormat == null || outputFormat.trim().isEmpty()) {
            outputFormat = "json";
        }
        
        try {
            // Convert input to JSON first (intermediate format)
            String jsonString;
            if (!"json".equalsIgnoreCase(inputFormat)) {
                jsonString = FormatConverter.convert(input, inputFormat, "json", null);
            } else {
                jsonString = input;
            }
            
            // Unflatten the JSON structure
            JsonNode root = mapper.readTree(jsonString);
            if (!root.isObject()) {
                throw new IllegalArgumentException("Input must be a flattened object structure");
            }
            
            ObjectNode result = mapper.createObjectNode();
            ObjectNode current = (ObjectNode) root;
            
            Iterator<Map.Entry<String, JsonNode>> fields = current.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String flatKey = entry.getKey();
                JsonNode value = entry.getValue();
                
                // Handle array indices like "items[0]"
                if (flatKey.contains("[")) {
                    unflattenWithArray(flatKey, value, result, separator);
                } else {
                    unflattenKey(flatKey, value, result, separator);
                }
            }
            
            String unflattenedJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(result);
            
            // Convert to output format if needed
            if (!"json".equalsIgnoreCase(outputFormat)) {
                return FormatConverter.convert(unflattenedJson, "json", outputFormat, null);
            }
            
            return unflattenedJson;
        } catch (Exception e) {
            throw new RuntimeException("Data unflattening failed: " + e.getMessage(), e);
        }
    }
    
    private static void unflattenKey(String flatKey, JsonNode value, ObjectNode result, String separator) {
        String[] parts = flatKey.split(Pattern.quote(separator));
        ObjectNode current = result;
        
        for (int i = 0; i < parts.length - 1; i++) {
            String part = parts[i];
            if (!current.has(part) || !current.get(part).isObject()) {
                current.set(part, mapper.createObjectNode());
            }
            current = (ObjectNode) current.get(part);
        }
        
        current.set(parts[parts.length - 1], value);
    }
    
    private static void unflattenWithArray(String flatKey, JsonNode value, ObjectNode result, String separator) {
        // Handle keys like "items[0].name"
        Pattern arrayPattern = Pattern.compile("(.+?)\\[(\\d+)\\](.*)");
        java.util.regex.Matcher matcher = arrayPattern.matcher(flatKey);
        
        if (matcher.matches()) {
            String baseKey = matcher.group(1);
            int index = Integer.parseInt(matcher.group(2));
            String remainder = matcher.group(3);
            
            if (!result.has(baseKey) || !result.get(baseKey).isArray()) {
                result.set(baseKey, mapper.createArrayNode());
            }
            
            ArrayNode array = (ArrayNode) result.get(baseKey);
            while (array.size() <= index) {
                array.add(mapper.createObjectNode());
            }
            
            if (remainder.isEmpty()) {
                array.set(index, value);
            } else {
                String newKey = remainder.startsWith(".") ? remainder.substring(1) : remainder;
                unflattenKey(newKey, value, (ObjectNode) array.get(index), separator);
            }
        }
    }
    
    /**
     * Rename keys in JSON
     */
    public static String renameKeys(String jsonString, String renameMapJson) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            throw new IllegalArgumentException("JSON string cannot be empty");
        }
        
        if (renameMapJson == null || renameMapJson.trim().isEmpty()) {
            throw new IllegalArgumentException("Rename map cannot be empty");
        }
        
        try {
            JsonNode root = mapper.readTree(jsonString);
            JsonNode renameMap = mapper.readTree(renameMapJson);
            
            if (!renameMap.isObject()) {
                throw new IllegalArgumentException("Rename map must be a JSON object");
            }
            
            JsonNode result = renameKeysRecursive(root, renameMap);
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(result);
        } catch (Exception e) {
            throw new RuntimeException("Key renaming failed: " + e.getMessage(), e);
        }
    }
    
    private static JsonNode renameKeysRecursive(JsonNode node, JsonNode renameMap) {
        if (node.isObject()) {
            ObjectNode result = mapper.createObjectNode();
            ObjectNode obj = (ObjectNode) node;
            ObjectNode map = (ObjectNode) renameMap;
            
            Iterator<Map.Entry<String, JsonNode>> fields = obj.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String oldKey = entry.getKey();
                JsonNode value = entry.getValue();
                
                // Check if this key should be renamed
                String newKey = map.has(oldKey) ? map.get(oldKey).asText() : oldKey;
                
                // Recursively process nested objects
                if (value.isObject() || value.isArray()) {
                    result.set(newKey, renameKeysRecursive(value, renameMap));
                } else {
                    result.set(newKey, value);
                }
            }
            return result;
        } else if (node.isArray()) {
            ArrayNode result = mapper.createArrayNode();
            ArrayNode array = (ArrayNode) node;
            
            for (JsonNode item : array) {
                result.add(renameKeysRecursive(item, renameMap));
            }
            return result;
        }
        return node;
    }
    
    /**
     * Transform values in JSON
     */
    public static String transformValues(String jsonString, String transformation) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            throw new IllegalArgumentException("JSON string cannot be empty");
        }
        
        if (transformation == null || transformation.trim().isEmpty()) {
            throw new IllegalArgumentException("Transformation cannot be empty");
        }
        
        try {
            JsonNode root = mapper.readTree(jsonString);
            JsonNode result = transformValuesRecursive(root, transformation);
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(result);
        } catch (Exception e) {
            throw new RuntimeException("Value transformation failed: " + e.getMessage(), e);
        }
    }
    
    private static JsonNode transformValuesRecursive(JsonNode node, String transformation) {
        if (node.isObject()) {
            ObjectNode result = mapper.createObjectNode();
            ObjectNode obj = (ObjectNode) node;
            
            Iterator<Map.Entry<String, JsonNode>> fields = obj.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String key = entry.getKey();
                JsonNode value = entry.getValue();
                
                if (value.isObject() || value.isArray()) {
                    result.set(key, transformValuesRecursive(value, transformation));
                } else {
                    result.set(key, transformValue(value, transformation));
                }
            }
            return result;
        } else if (node.isArray()) {
            ArrayNode result = mapper.createArrayNode();
            ArrayNode array = (ArrayNode) node;
            
            for (JsonNode item : array) {
                if (item.isObject() || item.isArray()) {
                    result.add(transformValuesRecursive(item, transformation));
                } else {
                    result.add(transformValue(item, transformation));
                }
            }
            return result;
        }
        return transformValue(node, transformation);
    }
    
    private static JsonNode transformValue(JsonNode value, String transformation) {
        String strValue = value.asText();
        
        switch (transformation.toLowerCase()) {
            case "uppercase":
                return new TextNode(strValue.toUpperCase());
            case "lowercase":
                return new TextNode(strValue.toLowerCase());
            case "trim":
                return new TextNode(strValue.trim());
            case "reverse":
                return new TextNode(new StringBuilder(strValue).reverse().toString());
            default:
                return value;
        }
    }
    
    /**
     * Filter/Remove fields from JSON or YAML (supports multiple formats)
     */
    public static String filterFields(String input, String inputFormat, String outputFormat, String fieldsToRemove) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        
        if (fieldsToRemove == null || fieldsToRemove.trim().isEmpty()) {
            throw new IllegalArgumentException("Fields to remove cannot be empty");
        }
        
        if (inputFormat == null || inputFormat.trim().isEmpty()) {
            inputFormat = "json";
        }
        
        if (outputFormat == null || outputFormat.trim().isEmpty()) {
            outputFormat = "json";
        }
        
        try {
            // Convert input to JSON first (intermediate format)
            String jsonString;
            if (!"json".equalsIgnoreCase(inputFormat)) {
                jsonString = FormatConverter.convert(input, inputFormat, "json", null);
            } else {
                jsonString = input;
            }
            
            // Parse fields to remove (comma-separated or JSON array)
            Set<String> fieldsSet = new HashSet<>();
            if (fieldsToRemove.trim().startsWith("[")) {
                JsonNode fieldsArray = mapper.readTree(fieldsToRemove);
                if (fieldsArray.isArray()) {
                    for (JsonNode field : fieldsArray) {
                        fieldsSet.add(field.asText());
                    }
                }
            } else {
                String[] fields = fieldsToRemove.split(",");
                for (String field : fields) {
                    fieldsSet.add(field.trim());
                }
            }
            
            // Filter the JSON structure
            JsonNode root = mapper.readTree(jsonString);
            JsonNode result = filterFieldsRecursive(root, fieldsSet);
            String filteredJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(result);
            
            // Convert to output format if needed
            if (!"json".equalsIgnoreCase(outputFormat)) {
                return FormatConverter.convert(filteredJson, "json", outputFormat, null);
            }
            
            return filteredJson;
        } catch (Exception e) {
            throw new RuntimeException("Field filtering failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Filter/Remove fields from JSON (backward compatibility method)
     */
    public static String filterFields(String jsonString, String fieldsToRemove) {
        return filterFields(jsonString, "json", "json", fieldsToRemove);
    }
    
    private static JsonNode filterFieldsRecursive(JsonNode node, Set<String> fieldsToRemove) {
        if (node.isObject()) {
            ObjectNode result = mapper.createObjectNode();
            ObjectNode obj = (ObjectNode) node;
            
            Iterator<Map.Entry<String, JsonNode>> fields = obj.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String key = entry.getKey();
                JsonNode value = entry.getValue();
                
                if (!fieldsToRemove.contains(key)) {
                    if (value.isObject() || value.isArray()) {
                        result.set(key, filterFieldsRecursive(value, fieldsToRemove));
                    } else {
                        result.set(key, value);
                    }
                }
            }
            return result;
        } else if (node.isArray()) {
            ArrayNode result = mapper.createArrayNode();
            ArrayNode array = (ArrayNode) node;
            
            for (JsonNode item : array) {
                result.add(filterFieldsRecursive(item, fieldsToRemove));
            }
            return result;
        }
        return node;
    }
    
    /**
     * Convert types in JSON or YAML (supports multiple formats)
     */
    public static String convertTypes(String input, String inputFormat, String outputFormat, String typeMapJson) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        
        if (typeMapJson == null || typeMapJson.trim().isEmpty()) {
            throw new IllegalArgumentException("Type map cannot be empty");
        }
        
        if (inputFormat == null || inputFormat.trim().isEmpty()) {
            inputFormat = "json";
        }
        
        if (outputFormat == null || outputFormat.trim().isEmpty()) {
            outputFormat = inputFormat; // Default to same format as input
        }
        
        try {
            // Convert input to JSON first (intermediate format)
            String jsonString;
            if (!"json".equalsIgnoreCase(inputFormat)) {
                jsonString = FormatConverter.convert(input, inputFormat, "json", null);
            } else {
                jsonString = input;
            }
            
            // Parse type map
            JsonNode typeMap = mapper.readTree(typeMapJson);
            if (!typeMap.isObject()) {
                throw new IllegalArgumentException("Type map must be a JSON object");
            }
            
            // Convert types in the JSON structure
            JsonNode root = mapper.readTree(jsonString);
            JsonNode result = convertTypesRecursive(root, typeMap);
            String convertedJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(result);
            
            // Convert to output format if needed
            if (!"json".equalsIgnoreCase(outputFormat)) {
                return FormatConverter.convert(convertedJson, "json", outputFormat, null);
            }
            
            return convertedJson;
        } catch (Exception e) {
            throw new RuntimeException("Type conversion failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Convert types in JSON (backward compatibility method)
     */
    public static String convertTypes(String jsonString, String typeMapJson) {
        return convertTypes(jsonString, "json", "json", typeMapJson);
    }
    
    private static JsonNode convertTypesRecursive(JsonNode node, JsonNode typeMap) {
        if (node.isObject()) {
            ObjectNode result = mapper.createObjectNode();
            ObjectNode obj = (ObjectNode) node;
            ObjectNode map = (ObjectNode) typeMap;
            
            Iterator<Map.Entry<String, JsonNode>> fields = obj.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String key = entry.getKey();
                JsonNode value = entry.getValue();
                
                if (value.isObject() || value.isArray()) {
                    result.set(key, convertTypesRecursive(value, typeMap));
                } else {
                    String targetType = map.has(key) ? map.get(key).asText() : null;
                    result.set(key, convertValue(value, targetType));
                }
            }
            return result;
        } else if (node.isArray()) {
            ArrayNode result = mapper.createArrayNode();
            ArrayNode array = (ArrayNode) node;
            
            for (JsonNode item : array) {
                if (item.isObject() || item.isArray()) {
                    result.add(convertTypesRecursive(item, typeMap));
                } else {
                    String targetType = typeMap.has("_default") ? typeMap.get("_default").asText() : null;
                    result.add(convertValue(item, targetType));
                }
            }
            return result;
        }
        return node;
    }
    
    private static JsonNode convertValue(JsonNode value, String targetType) {
        if (targetType == null || targetType.isEmpty()) {
            return value;
        }
        
        String strValue = value.asText();
        
        try {
            switch (targetType.toLowerCase()) {
                case "number":
                case "int":
                    if (strValue.matches("-?\\d+")) {
                        return new IntNode(Integer.parseInt(strValue));
                    } else if (strValue.matches("-?\\d+\\.\\d+")) {
                        return new DoubleNode(Double.parseDouble(strValue));
                    }
                    break;
                case "float":
                case "double":
                    return new DoubleNode(Double.parseDouble(strValue));
                case "boolean":
                case "bool":
                    return BooleanNode.valueOf(Boolean.parseBoolean(strValue));
                case "string":
                    return new TextNode(strValue);
                case "null":
                    return NullNode.getInstance();
            }
        } catch (Exception e) {
            // If conversion fails, return original value
        }
        
        return value;
    }
}

