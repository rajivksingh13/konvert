package com.konvert.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.konvert.FormatConverter;

import java.io.ByteArrayOutputStream;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.Base64;
import java.util.zip.GZIPOutputStream;
import java.util.zip.GZIPInputStream;

public class MinifyUtil {
    
    private static final ObjectMapper jsonMapper = new ObjectMapper();
    private static final XmlMapper xmlMapper = new XmlMapper();
    
    /**
     * Minify data based on format
     */
    public static String minify(String input, String format) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        
        if (format == null || format.trim().isEmpty()) {
            format = "json";
        }
        
        format = format.toLowerCase();
        
        switch (format) {
            case "json":
                return minifyJson(input);
            case "xml":
                return minifyXml(input);
            case "css":
                return minifyCss(input);
            case "toon":
                return minifyToon(input);
            default:
                throw new IllegalArgumentException("Unsupported format for minification: " + format);
        }
    }
    
    /**
     * Beautify CSS - properly formats minified CSS with proper indentation
     */
    public static String beautifyCss(String css) {
        if (css == null || css.trim().isEmpty()) {
            return css;
        }
        
        try {
            // First, normalize the CSS by removing comments and extra whitespace
            String normalized = css;
            
            // Remove CSS comments
            normalized = normalized.replaceAll("/\\*.*?\\*/", "");
            
            // Normalize whitespace - replace all whitespace with single space
            normalized = normalized.replaceAll("\\s+", " ");
            
            StringBuilder result = new StringBuilder();
            int indentLevel = 0;
            String indent = "  "; // 2 spaces
            boolean inString = false;
            char stringChar = 0;
            char[] chars = normalized.toCharArray();
            
            for (int i = 0; i < chars.length; i++) {
                char c = chars[i];
                char prev = (i > 0) ? chars[i - 1] : 0;
                
                // Handle strings (single or double quotes)
                if (c == '"' || c == '\'') {
                    if (!inString) {
                        inString = true;
                        stringChar = c;
                    } else if (c == stringChar && prev != '\\') {
                        inString = false;
                        stringChar = 0;
                    }
                    result.append(c);
                    continue;
                }
                
                // Skip processing if inside a string
                if (inString) {
                    result.append(c);
                    continue;
                }
                
                // Handle opening brace
                if (c == '{') {
                    result.append(" {\n");
                    indentLevel++;
                    // Add indentation
                    for (int j = 0; j < indentLevel; j++) {
                        result.append(indent);
                    }
                    continue;
                }
                
                // Handle closing brace
                if (c == '}') {
                    indentLevel = Math.max(0, indentLevel - 1);
                    result.append("\n");
                    // Add indentation for the closing brace
                    for (int j = 0; j < indentLevel; j++) {
                        result.append(indent);
                    }
                    result.append("}");
                    // Add newline after closing brace if there's more content
                    if (i + 1 < chars.length) {
                        // Skip whitespace to find next non-whitespace char
                        int nextIdx = i + 1;
                        while (nextIdx < chars.length && Character.isWhitespace(chars[nextIdx])) {
                            nextIdx++;
                        }
                        if (nextIdx < chars.length && chars[nextIdx] != '}') {
                            result.append("\n");
                        }
                    }
                    continue;
                }
                
                // Handle semicolon (end of property)
                if (c == ';') {
                    result.append(";\n");
                    // Add indentation for next property
                    for (int j = 0; j < indentLevel; j++) {
                        result.append(indent);
                    }
                    continue;
                }
                
                // Handle colon (property-value separator)
                if (c == ':') {
                    result.append(": ");
                    continue;
                }
                
                // Handle comma (multiple selectors or values)
                if (c == ',') {
                    result.append(", ");
                    continue;
                }
                
                // Regular character
                if (c != ' ') { // Skip spaces as we're adding them manually
                    result.append(c);
                }
            }
            
            // Clean up: remove trailing whitespace from each line
            String[] lines = result.toString().split("\n");
            StringBuilder cleaned = new StringBuilder();
            for (String line : lines) {
                String trimmed = line.trim();
                if (!trimmed.isEmpty()) {
                    cleaned.append(trimmed).append("\n");
                }
            }
            
            return cleaned.toString().trim();
        } catch (Exception e) {
            // If beautification fails, try a simpler approach
            try {
                String basic = css;
                // Remove comments
                basic = basic.replaceAll("/\\*.*?\\*/", "");
                // Add line breaks around braces and semicolons
                basic = basic.replaceAll("\\s*\\{\\s*", " {\n");
                basic = basic.replaceAll("\\s*\\}\\s*", "\n}\n");
                basic = basic.replaceAll("\\s*;\\s*", ";\n");
                basic = basic.replaceAll("\\s*:\\s*", ": ");
                basic = basic.replaceAll("\\s*,\\s*", ", ");
                // Clean up multiple newlines
                basic = basic.replaceAll("\n\n+", "\n");
                return basic.trim();
            } catch (Exception ex) {
                return css;
            }
        }
    }
    
    /**
     * Minify JSON
     */
    private static String minifyJson(String json) {
        try {
            // Parse and re-serialize without pretty printing
            Object parsed = jsonMapper.readValue(json, Object.class);
            return jsonMapper.writeValueAsString(parsed);
        } catch (Exception e) {
            throw new RuntimeException("Failed to minify JSON: " + e.getMessage(), e);
        }
    }
    
    /**
     * Minify TOON
     */
    private static String minifyToon(String toon) {
        try {
            // Convert TOON to JSON (intermediate format)
            String jsonString = FormatConverter.convert(toon, "toon", "json", null);
            // Convert back to TOON (will produce compact format)
            String compactToon = FormatConverter.convert(jsonString, "json", "toon", null);
            // Remove extra whitespace and line breaks where possible
            return compactToon.replaceAll("\n\\s*\n", "\n").trim();
        } catch (Exception e) {
            throw new RuntimeException("Failed to minify TOON: " + e.getMessage(), e);
        }
    }
    
    /**
     * Minify XML
     */
    private static String minifyXml(String xml) {
        try {
            // Remove comments
            xml = xml.replaceAll("<!--.*?-->", "");
            
            // Remove extra whitespace between tags
            xml = xml.replaceAll(">\\s+<", "><");
            
            // Trim whitespace
            xml = xml.trim();
            
            // Validate by parsing
            xmlMapper.readTree(xml);
            
            return xml;
        } catch (Exception e) {
            // If parsing fails, try basic minification without validation
            String minified = xml.replaceAll("<!--.*?-->", "")
                                .replaceAll(">\\s+<", "><")
                                .replaceAll("\\s+", " ")
                                .trim();
            return minified;
        }
    }
    
    /**
     * Minify CSS
     */
    private static String minifyCss(String css) {
        if (css == null || css.trim().isEmpty()) {
            return css;
        }
        
        try {
            String result = css;
            
            // Remove CSS block comments (/* ... */) - use a simpler, non-greedy pattern
            // This pattern is more reliable and handles edge cases better
            result = result.replaceAll("/\\*.*?\\*/", "");
            
            // Remove extra whitespace and newlines
            result = result.replaceAll("\\s+", " ");
            
            // Remove whitespace around braces
            result = result.replaceAll("\\s*\\{\\s*", "{");
            result = result.replaceAll("\\s*\\}\\s*", "}");
            
            // Remove whitespace around semicolons
            result = result.replaceAll("\\s*;\\s*", ";");
            
            // Remove whitespace around colons
            result = result.replaceAll("\\s*:\\s*", ":");
            
            // Remove whitespace around commas
            result = result.replaceAll("\\s*,\\s*", ",");
            
            // Remove whitespace around selectors
            result = result.replaceAll("\\s*>\\s*", ">");
            result = result.replaceAll("\\s*\\+\\s*", "+");
            result = result.replaceAll("\\s*~\\s*", "~");
            
            // Remove trailing semicolons before closing braces
            result = result.replaceAll(";\\s*\\}", "}");
            
            // Trim whitespace
            result = result.trim();
            
            return result;
        } catch (Exception e) {
            // If minification fails, try a simpler fallback approach
            try {
                String basic = css;
                // Remove comments with a simpler pattern
                basic = basic.replaceAll("/\\*.*?\\*/", "");
                // Collapse whitespace
                basic = basic.replaceAll("\\s+", " ").trim();
                return basic;
            } catch (Exception ex) {
                // If even basic minification fails, return original with minimal processing
                try {
                    return css.replaceAll("\\s+", " ").trim();
                } catch (Exception finalEx) {
                    // Last resort: return original
                    return css;
                }
            }
        }
    }
    
    /**
     * Remove comments and whitespace from any text
     */
    public static String removeCommentsAndWhitespace(String input, String format) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }
        
        if (format == null || format.trim().isEmpty()) {
            format = "text";
        }
        
        format = format.toLowerCase();
        
        String result = input;
        
        // Remove comments based on format
        switch (format) {
            case "json":
                // JSON doesn't support comments, but remove whitespace
                result = minifyJson(result);
                break;
            case "xml":
                // Remove XML comments
                result = result.replaceAll("<!--.*?-->", "");
                // Remove extra whitespace
                result = result.replaceAll(">\\s+<", "><");
                result = result.replaceAll("\\s+", " ").trim();
                break;
            case "css":
                // Remove CSS comments
                result = result.replaceAll("/\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/", "");
                result = result.replaceAll("//.*", "");
                // Remove extra whitespace
                result = result.replaceAll("\\s+", " ").trim();
                break;
            case "javascript":
            case "js":
                // Remove JS comments
                result = result.replaceAll("/\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/", "");
                result = result.replaceAll("//.*", "");
                // Remove extra whitespace
                result = result.replaceAll("\\s+", " ").trim();
                break;
            case "html":
                // Remove HTML comments
                result = result.replaceAll("<!--.*?-->", "");
                // Remove extra whitespace
                result = result.replaceAll(">\\s+<", "><");
                result = result.replaceAll("\\s+", " ").trim();
                break;
            default:
                // Generic: remove common comment patterns
                result = result.replaceAll("/\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/", "");
                result = result.replaceAll("//.*", "");
                result = result.replaceAll("<!--.*?-->", "");
                // Remove extra whitespace
                result = result.replaceAll("\\s+", " ").trim();
                break;
        }
        
        return result;
    }
    
    /**
     * Compress data using GZIP and return base64 encoded result
     */
    public static Map<String, Object> compressGzip(String input) {
        Map<String, Object> result = new LinkedHashMap<>();
        
        if (input == null || input.trim().isEmpty()) {
            result.put("success", false);
            result.put("error", "Input cannot be empty");
            return result;
        }
        
        try {
            byte[] inputBytes = input.getBytes(StandardCharsets.UTF_8);
            int originalSize = inputBytes.length;
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try (GZIPOutputStream gzos = new GZIPOutputStream(baos)) {
                gzos.write(inputBytes);
            }
            
            byte[] compressed = baos.toByteArray();
            int compressedSize = compressed.length;
            
            // Calculate compression ratio
            double compressionRatio = originalSize > 0 ? 
                (1.0 - (double) compressedSize / originalSize) * 100 : 0;
            
            // Encode to base64 for display
            String base64Encoded = Base64.getEncoder().encodeToString(compressed);
            
            result.put("success", true);
            result.put("originalSize", originalSize);
            result.put("compressedSize", compressedSize);
            result.put("compressionRatio", String.format("%.2f%%", compressionRatio));
            result.put("base64Encoded", base64Encoded);
            result.put("bytesSaved", originalSize - compressedSize);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Compression failed: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Decompress GZIP compressed data from base64 encoded string
     */
    public static Map<String, Object> decompressGzip(String base64Input) {
        Map<String, Object> result = new LinkedHashMap<>();
        
        if (base64Input == null || base64Input.trim().isEmpty()) {
            result.put("success", false);
            result.put("error", "Input cannot be empty");
            return result;
        }
        
        try {
            // Decode base64 to get compressed bytes
            byte[] compressedBytes;
            try {
                compressedBytes = Base64.getDecoder().decode(base64Input.trim());
            } catch (IllegalArgumentException e) {
                result.put("success", false);
                result.put("error", "Invalid Base64 encoded data: " + e.getMessage());
                return result;
            }
            
            int compressedSize = compressedBytes.length;
            
            // Decompress using GZIP
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try (GZIPInputStream gzis = new GZIPInputStream(new ByteArrayInputStream(compressedBytes))) {
                byte[] buffer = new byte[1024];
                int len;
                while ((len = gzis.read(buffer)) != -1) {
                    baos.write(buffer, 0, len);
                }
            }
            
            byte[] decompressed = baos.toByteArray();
            int decompressedSize = decompressed.length;
            
            // Convert to string
            String decompressedText = new String(decompressed, StandardCharsets.UTF_8);
            
            // Calculate expansion ratio
            double expansionRatio = compressedSize > 0 ? 
                ((double) decompressedSize / compressedSize - 1.0) * 100 : 0;
            
            result.put("success", true);
            result.put("compressedSize", compressedSize);
            result.put("decompressedSize", decompressedSize);
            result.put("expansionRatio", String.format("%.2f%%", expansionRatio));
            result.put("output", decompressedText);
            result.put("bytesRestored", decompressedSize - compressedSize);
            
        } catch (java.util.zip.ZipException e) {
            result.put("success", false);
            result.put("error", "Invalid GZIP format: The input data is not a valid GZIP compressed file");
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Decompression failed: " + e.getMessage());
        }
        
        return result;
    }
}

