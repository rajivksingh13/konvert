package com.konvert.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashUtil {
    
    /**
     * Generate hash using specified algorithm
     */
    public static String generateHash(String input, String algorithm) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException("Input cannot be empty");
        }
        
        if (algorithm == null || algorithm.trim().isEmpty()) {
            throw new IllegalArgumentException("Algorithm cannot be empty");
        }
        
        try {
            MessageDigest digest = MessageDigest.getInstance(algorithm.toUpperCase());
            byte[] hashBytes = digest.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            
            // Convert bytes to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Unsupported hash algorithm: " + algorithm, e);
        } catch (Exception e) {
            throw new RuntimeException("Hash generation failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate MD5 hash
     */
    public static String md5(String input) {
        return generateHash(input, "MD5");
    }
    
    /**
     * Generate SHA-1 hash
     */
    public static String sha1(String input) {
        return generateHash(input, "SHA-1");
    }
    
    /**
     * Generate SHA-256 hash
     */
    public static String sha256(String input) {
        return generateHash(input, "SHA-256");
    }
    
    /**
     * Generate SHA-512 hash
     */
    public static String sha512(String input) {
        return generateHash(input, "SHA-512");
    }
}

