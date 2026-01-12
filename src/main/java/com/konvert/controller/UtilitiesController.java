package com.konvert.controller;

import com.konvert.util.DataTransformUtil;
import com.konvert.util.EncodingUtil;
import com.konvert.util.HashUtil;
import com.konvert.util.JWTUtil;
import com.konvert.util.UUIDUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/utilities")
@CrossOrigin(origins = "*")
public class UtilitiesController {
    
    // URL Encoding/Decoding
    @PostMapping("/url/encode")
    public ResponseEntity<Map<String, Object>> urlEncode(@RequestBody Map<String, String> request) {
        return handleRequest(request, EncodingUtil::urlEncode, "URL encoding");
    }
    
    @PostMapping("/url/decode")
    public ResponseEntity<Map<String, Object>> urlDecode(@RequestBody Map<String, String> request) {
        return handleRequest(request, EncodingUtil::urlDecode, "URL decoding");
    }
    
    // HTML Entity Encoding/Decoding
    @PostMapping("/html/encode")
    public ResponseEntity<Map<String, Object>> htmlEncode(@RequestBody Map<String, String> request) {
        return handleRequest(request, EncodingUtil::htmlEncode, "HTML encoding");
    }
    
    @PostMapping("/html/decode")
    public ResponseEntity<Map<String, Object>> htmlDecode(@RequestBody Map<String, String> request) {
        return handleRequest(request, EncodingUtil::htmlDecode, "HTML decoding");
    }
    
    // Hex Encoding/Decoding
    @PostMapping("/hex/encode")
    public ResponseEntity<Map<String, Object>> hexEncode(@RequestBody Map<String, String> request) {
        return handleRequest(request, EncodingUtil::hexEncode, "Hex encoding");
    }
    
    @PostMapping("/hex/decode")
    public ResponseEntity<Map<String, Object>> hexDecode(@RequestBody Map<String, String> request) {
        return handleRequest(request, EncodingUtil::hexDecode, "Hex decoding");
    }
    
    // JWT Decoder
    @PostMapping("/jwt/decode")
    public ResponseEntity<Map<String, Object>> jwtDecode(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "JWT token is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> result = JWTUtil.decodeJWT(input);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // UUID Generator
    @PostMapping("/uuid/generate")
    public ResponseEntity<Map<String, Object>> generateUUID(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String version = (String) request.getOrDefault("version", "v4");
            Integer count = request.get("count") != null ? 
                Integer.parseInt(request.get("count").toString()) : 1;
            
            if (count < 1 || count > 100) {
                response.put("success", false);
                response.put("error", "Count must be between 1 and 100");
                return ResponseEntity.badRequest().body(response);
            }
            
            String[] uuids = UUIDUtil.generateMultiple(count, version);
            
            response.put("success", true);
            response.put("output", uuids);
            response.put("count", uuids.length);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Hash Generator
    @PostMapping("/hash/generate")
    public ResponseEntity<Map<String, Object>> generateHash(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String algorithm = request.getOrDefault("algorithm", "SHA-256");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String hash = HashUtil.generateHash(input, algorithm);
            
            response.put("success", true);
            response.put("output", hash);
            response.put("algorithm", algorithm.toUpperCase());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Helper method for encoding/decoding operations
    private ResponseEntity<Map<String, Object>> handleRequest(
            Map<String, String> request, 
            java.util.function.Function<String, String> operation,
            String operationName) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = operation.apply(input);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Data Transformation Endpoints
    @PostMapping("/transform/merge")
    public ResponseEntity<Map<String, Object>> mergeJson(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            @SuppressWarnings("unchecked")
            java.util.List<String> jsonStrings = (java.util.List<String>) request.get("inputs");
            
            if (jsonStrings == null || jsonStrings.isEmpty()) {
                response.put("success", false);
                response.put("error", "At least one JSON string is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = DataTransformUtil.mergeJson(jsonStrings.toArray(new String[0]));
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/transform/flatten")
    public ResponseEntity<Map<String, Object>> flattenData(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String separator = request.getOrDefault("separator", "");
            String inputFormat = request.getOrDefault("inputFormat", "json");
            String outputFormat = request.getOrDefault("outputFormat", "json");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // If separator is empty, use default
            if (separator == null || separator.isEmpty()) {
                separator = ".";
            }
            
            String result = DataTransformUtil.flattenData(input, inputFormat, outputFormat, separator);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/transform/unflatten")
    public ResponseEntity<Map<String, Object>> unflattenData(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String separator = request.getOrDefault("separator", "");
            String inputFormat = request.getOrDefault("inputFormat", "json");
            String outputFormat = request.getOrDefault("outputFormat", "json");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // If separator is empty, use default
            if (separator == null || separator.isEmpty()) {
                separator = ".";
            }
            
            String result = DataTransformUtil.unflattenData(input, inputFormat, outputFormat, separator);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/transform/rename-keys")
    public ResponseEntity<Map<String, Object>> renameKeys(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String renameMap = request.get("renameMap");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input JSON is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (renameMap == null || renameMap.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Rename map is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = DataTransformUtil.renameKeys(input, renameMap);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/transform/transform-values")
    public ResponseEntity<Map<String, Object>> transformValues(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String transformation = request.get("transformation");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input JSON is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (transformation == null || transformation.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Transformation type is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = DataTransformUtil.transformValues(input, transformation);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/transform/filter-fields")
    public ResponseEntity<Map<String, Object>> filterFields(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String fieldsToRemove = request.get("fieldsToRemove");
            String inputFormat = request.get("inputFormat");
            String outputFormat = request.get("outputFormat");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (fieldsToRemove == null || fieldsToRemove.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Fields to remove are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Use defaults if not provided (backward compatibility)
            if (inputFormat == null || inputFormat.trim().isEmpty()) {
                inputFormat = "json";
            }
            if (outputFormat == null || outputFormat.trim().isEmpty()) {
                outputFormat = inputFormat; // Default to same format as input
            }
            
            String result = DataTransformUtil.filterFields(input, inputFormat, outputFormat, fieldsToRemove);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/transform/convert-types")
    public ResponseEntity<Map<String, Object>> convertTypes(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String typeMap = request.get("typeMap");
            String inputFormat = request.get("inputFormat");
            String outputFormat = request.get("outputFormat");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (typeMap == null || typeMap.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Type map is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Use defaults if not provided (backward compatibility)
            if (inputFormat == null || inputFormat.trim().isEmpty()) {
                inputFormat = "json";
            }
            if (outputFormat == null || outputFormat.trim().isEmpty()) {
                outputFormat = inputFormat; // Default to same format as input
            }
            
            String result = DataTransformUtil.convertTypes(input, inputFormat, outputFormat, typeMap);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

