package com.konvert.controller;

import com.konvert.Base64Util;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class Base64Controller {

    @PostMapping("/base64/encode")
    public ResponseEntity<Map<String, Object>> encode(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = Base64Util.encode(input);
            
            response.put("success", true);
            response.put("output", result);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/base64/decode")
    public ResponseEntity<Map<String, Object>> decode(
            @RequestBody Map<String, String> request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String input = request.get("input");
            
            if (input == null || input.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Input data is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String result = Base64Util.decode(input);
            
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

