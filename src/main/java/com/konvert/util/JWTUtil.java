package com.konvert.util;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class JWTUtil {
    
    /**
     * Decode JWT token (read-only, no verification)
     */
    public static Map<String, Object> decodeJWT(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("JWT token cannot be empty");
        }
        
        try {
            String[] parts = token.trim().split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid JWT format. Expected 3 parts separated by dots.");
            }
            
            Map<String, Object> result = new HashMap<>();
            
            // Decode Header
            String headerJson = decodeBase64Url(parts[0]);
            result.put("header", headerJson);
            
            // Decode Payload
            String payloadJson = decodeBase64Url(parts[1]);
            result.put("payload", payloadJson);
            
            // Signature (not decoded, just shown)
            result.put("signature", parts[2]);
            
            // Parse header and payload as JSON-like strings
            result.put("headerParsed", parseJsonLike(headerJson));
            result.put("payloadParsed", parseJsonLike(payloadJson));
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("JWT decoding failed: " + e.getMessage(), e);
        }
    }
    
    private static String decodeBase64Url(String base64Url) {
        try {
            // Replace URL-safe characters
            String base64 = base64Url.replace('-', '+').replace('_', '/');
            
            // Add padding if needed
            switch (base64.length() % 4) {
                case 2: base64 += "=="; break;
                case 3: base64 += "="; break;
            }
            
            byte[] decoded = Base64.getDecoder().decode(base64);
            return new String(decoded, java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decode base64: " + e.getMessage(), e);
        }
    }
    
    private static String parseJsonLike(String json) {
        // Simple JSON formatting (for display purposes)
        // This is a basic formatter, not a full JSON parser
        return json
            .replace("{", "{\n  ")
            .replace("}", "\n}")
            .replace(",", ",\n  ")
            .replace(":", ": ");
    }
}

