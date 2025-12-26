package com.konvert.util;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class EncodingUtil {
    
    /**
     * URL Encode
     */
    public static String urlEncode(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        try {
            return URLEncoder.encode(input, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            throw new RuntimeException("URL encoding failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * URL Decode
     */
    public static String urlDecode(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        try {
            return URLDecoder.decode(input, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            throw new RuntimeException("URL decoding failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * HTML Entity Encode
     */
    public static String htmlEncode(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        StringBuilder sb = new StringBuilder();
        for (char c : input.toCharArray()) {
            switch (c) {
                case '&': sb.append("&amp;"); break;
                case '<': sb.append("&lt;"); break;
                case '>': sb.append("&gt;"); break;
                case '"': sb.append("&quot;"); break;
                case '\'': sb.append("&apos;"); break;
                default:
                    if (c > 127) {
                        sb.append("&#").append((int) c).append(";");
                    } else {
                        sb.append(c);
                    }
            }
        }
        return sb.toString();
    }
    
    /**
     * HTML Entity Decode
     */
    public static String htmlDecode(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        String result = input
            .replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", "\"")
            .replace("&apos;", "'")
            .replace("&#39;", "'");
        
        // Decode numeric entities
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("&#(\\d+);");
        java.util.regex.Matcher matcher = pattern.matcher(result);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            int code = Integer.parseInt(matcher.group(1));
            matcher.appendReplacement(sb, String.valueOf((char) code));
        }
        matcher.appendTail(sb);
        result = sb.toString();
        
        return result;
    }
    
    /**
     * Hex Encode
     */
    public static String hexEncode(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        try {
            byte[] bytes = input.getBytes(StandardCharsets.UTF_8);
            StringBuilder hex = new StringBuilder();
            for (byte b : bytes) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("Hex encoding failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Hex Decode
     */
    public static String hexDecode(String input) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        try {
            // Remove spaces and common separators
            String cleaned = input.trim().replaceAll("[\\s-:]", "");
            
            // Validate hex string
            if (!cleaned.matches("[0-9a-fA-F]+")) {
                throw new IllegalArgumentException("Invalid hex string");
            }
            
            // Ensure even length
            if (cleaned.length() % 2 != 0) {
                cleaned = "0" + cleaned;
            }
            
            byte[] bytes = new byte[cleaned.length() / 2];
            for (int i = 0; i < bytes.length; i++) {
                int index = i * 2;
                bytes[i] = (byte) Integer.parseInt(cleaned.substring(index, index + 2), 16);
            }
            
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Hex decoding failed: " + e.getMessage(), e);
        }
    }
}

