package com.konvert;

import java.util.Base64;

public class Base64Util {
    
    /**
     * Encode a string to Base64
     */
    public static String encode(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        try {
            byte[] bytes = input.getBytes("UTF-8");
            return Base64.getEncoder().encodeToString(bytes);
        } catch (Exception e) {
            throw new RuntimeException("Base64 encoding failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Decode a Base64 string
     */
    public static String decode(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        try {
            // Remove whitespace and newlines
            String cleaned = input.trim().replaceAll("\\s+", "");
            byte[] decoded = Base64.getDecoder().decode(cleaned);
            return new String(decoded, "UTF-8");
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid Base64 string: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Base64 decoding failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Check if a string is valid Base64
     */
    public static boolean isValidBase64(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }
        try {
            String cleaned = input.trim().replaceAll("\\s+", "");
            Base64.getDecoder().decode(cleaned);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

