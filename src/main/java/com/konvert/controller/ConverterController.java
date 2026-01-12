package com.konvert.controller;

import com.konvert.FormatConverter;
import com.konvert.util.ToonStatisticsUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ConverterController {

    @PostMapping("/convert")
    public ResponseEntity<Map<String, Object>> convert(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            String fromFormat = request.get("fromFormat");
            String toFormat = request.get("toFormat");
            String protobufSchema = request.getOrDefault("protobufSchema", "");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (fromFormat == null || toFormat == null) {
                response.put("success", false);
                response.put("error", "From and to formats are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check for Protobuf schema requirement
            if (("protobuf".equals(fromFormat) || "protobuf".equals(toFormat)) 
                && (protobufSchema == null || protobufSchema.trim().isEmpty())) {
                response.put("success", false);
                response.put("error", "Protobuf schema is required for Protobuf conversions");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = FormatConverter.convert(input, fromFormat, toFormat, protobufSchema);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/toon/statistics")
    public ResponseEntity<Map<String, Object>> getToonStatistics(
            @RequestBody Map<String, String> request) {
        
        try {
            String input = request.get("input");
            String originalFormat = request.get("originalFormat");
            
            if (input == null || input.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (originalFormat == null || originalFormat.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Original format is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Analyze TOON efficiency
            Map<String, Object> statistics = ToonStatisticsUtil.analyzeFromOriginal(input, originalFormat);
            
            return ResponseEntity.ok(statistics);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Failed to calculate statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

