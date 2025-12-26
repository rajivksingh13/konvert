package com.konvert.controller;

import com.konvert.FormatFormatter;
import com.konvert.util.CsvUtil;
import com.konvert.util.MinifyUtil;
import com.konvert.util.DiffUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FormatterController {

    @PostMapping("/format")
    public ResponseEntity<Map<String, Object>> format(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String formatType = request.get("formatType");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (formatType == null) {
                response.put("success", false);
                response.put("error", "Format type is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result;
            if ("JSON".equalsIgnoreCase(formatType)) {
                result = FormatFormatter.formatJson(input);
            } else if ("YAML".equalsIgnoreCase(formatType)) {
                result = FormatFormatter.formatYaml(input);
            } else if ("CSV".equalsIgnoreCase(formatType)) {
                boolean alignColumns = Boolean.parseBoolean(request.getOrDefault("alignColumns", "false"));
                result = CsvUtil.formatCsv(input, alignColumns);
            } else {
                response.put("success", false);
                response.put("error", "Unsupported format type: " + formatType);
                return ResponseEntity.badRequest().body(response);
            }
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateSchema(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String format = request.getOrDefault("format", "json");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> validationResult = com.konvert.util.SchemaValidationUtil.validate(input, format);
            
            response.put("success", true);
            response.putAll(validationResult);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/minify")
    public ResponseEntity<Map<String, Object>> minify(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String format = request.getOrDefault("format", "json");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = MinifyUtil.minify(input, format);
            
            response.put("success", true);
            response.put("output", result);
            response.put("format", format);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/beautify/css")
    public ResponseEntity<Map<String, Object>> beautifyCss(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "CSS input is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = MinifyUtil.beautifyCss(input);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/compress/gzip")
    public ResponseEntity<Map<String, Object>> compressGzip(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> compressionResult = MinifyUtil.compressGzip(input);
            
            response.putAll(compressionResult);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/remove-comments")
    public ResponseEntity<Map<String, Object>> removeComments(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String format = request.getOrDefault("format", "text");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = MinifyUtil.removeCommentsAndWhitespace(input, format);
            
            response.put("success", true);
            response.put("output", result);
            response.put("format", format);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/diff/compare")
    public ResponseEntity<Map<String, Object>> compare(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input1 = request.get("input1");
            String input2 = request.get("input2");
            String format = request.getOrDefault("format", "json");
            
            if (input1 == null || input1.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "First input is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (input2 == null || input2.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Second input is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> comparisonResult = DiffUtil.compare(input1, input2, format);
            
            response.putAll(comparisonResult);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/diff/report")
    public ResponseEntity<Map<String, Object>> generateDiffReport(
            @RequestBody Map<String, Object> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> comparisonResult = (Map<String, Object>) request.get("comparisonResult");
            
            if (comparisonResult == null) {
                response.put("success", false);
                response.put("error", "Comparison result is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String report = DiffUtil.generateDiffReport(comparisonResult);
            
            response.put("success", true);
            response.put("report", report);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

