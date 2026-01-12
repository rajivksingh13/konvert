package com.konvert.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

public class FileFormatDetector {
    
    private static final Pattern JSON_PATTERN = Pattern.compile("^\\s*[\\{\\[].*[\\}\\]]", Pattern.DOTALL);
    private static final Pattern XML_PATTERN = Pattern.compile("^\\s*<[^>]+>.*</[^>]+>", Pattern.DOTALL);
    private static final Pattern YAML_PATTERN = Pattern.compile("^\\s*[a-zA-Z_][a-zA-Z0-9_]*\\s*:", Pattern.MULTILINE);
    private static final Pattern TOML_PATTERN = Pattern.compile("^\\s*\\[.*\\]\\s*$", Pattern.MULTILINE);
    private static final Pattern PROPERTIES_PATTERN = Pattern.compile("^\\s*[a-zA-Z0-9._-]+\\s*=\\s*.*$", Pattern.MULTILINE);
    private static final Pattern CSV_PATTERN = Pattern.compile("^[^,]+(,[^,]+)+", Pattern.MULTILINE);
    
    /**
     * Detect file format from filename extension
     */
    public static String detectFromFilename(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "unknown";
        }
        
        String lower = filename.toLowerCase();
        if (lower.endsWith(".json")) return "json";
        if (lower.endsWith(".yaml") || lower.endsWith(".yml")) return "yaml";
        if (lower.endsWith(".xml")) return "xml";
        if (lower.endsWith(".toml")) return "toml";
        if (lower.endsWith(".toon")) return "toon";
        if (lower.endsWith(".properties") || lower.endsWith(".prop")) return "properties";
        if (lower.endsWith(".csv")) return "csv";
        if (lower.endsWith(".proto") || lower.endsWith(".protobuf")) return "protobuf";
        
        return "unknown";
    }
    
    /**
     * Detect file format from content
     */
    public static String detectFromContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            return "unknown";
        }
        
        String trimmed = content.trim();
        
        // Check JSON
        if (JSON_PATTERN.matcher(trimmed).matches()) {
            try {
                // Try to parse as JSON to confirm
                if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                    return "json";
                }
            } catch (Exception e) {
                // Not JSON
            }
        }
        
        // Check XML
        if (trimmed.startsWith("<") && trimmed.contains(">")) {
            if (XML_PATTERN.matcher(trimmed).matches()) {
                return "xml";
            }
        }
        
        // Check YAML
        if (YAML_PATTERN.matcher(trimmed).find()) {
            // Additional check: YAML usually has key-value pairs
            if (trimmed.contains(":") && !trimmed.startsWith("<")) {
                return "yaml";
            }
        }
        
        // Check TOML
        if (TOML_PATTERN.matcher(trimmed).find()) {
            return "toml";
        }
        
        // Check Properties
        if (PROPERTIES_PATTERN.matcher(trimmed).find() && !trimmed.contains("{")) {
            return "properties";
        }
        
        // Check CSV (has commas and multiple lines)
        if (CSV_PATTERN.matcher(trimmed).find() && trimmed.split("\n").length > 1) {
            return "csv";
        }
        
        return "unknown";
    }
    
    /**
     * Detect format from file input stream
     */
    public static String detectFromStream(InputStream inputStream, String filename) throws IOException {
        // First try filename
        String format = detectFromFilename(filename);
        if (!"unknown".equals(format)) {
            return format;
        }
        
        // Then try content
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            
            StringBuilder content = new StringBuilder();
            String line;
            int lineCount = 0;
            
            // Read first 50 lines or 10KB, whichever comes first
            while ((line = reader.readLine()) != null && lineCount < 50 && content.length() < 10000) {
                content.append(line).append("\n");
                lineCount++;
            }
            
            return detectFromContent(content.toString());
        }
    }
    
    /**
     * Get file extension for a format
     */
    public static String getExtensionForFormat(String format) {
        if (format == null) return ".txt";
        
        switch (format.toLowerCase()) {
            case "json": return ".json";
            case "yaml": return ".yaml";
            case "xml": return ".xml";
            case "toml": return ".toml";
            case "toon": return ".toon";
            case "properties": return ".properties";
            case "csv": return ".csv";
            case "protobuf": return ".proto";
            default: return ".txt";
        }
    }
    
    /**
     * Change file extension
     */
    public static String changeExtension(String filename, String newExtension) {
        if (filename == null) return "converted" + newExtension;
        
        int lastDot = filename.lastIndexOf('.');
        if (lastDot > 0) {
            return filename.substring(0, lastDot) + newExtension;
        }
        return filename + newExtension;
    }
}

