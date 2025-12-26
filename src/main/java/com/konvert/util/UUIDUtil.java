package com.konvert.util;

import java.util.UUID;

public class UUIDUtil {
    
    /**
     * Generate UUID v4 (random)
     */
    public static String generateUUIDv4() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Generate UUID v1 (time-based)
     * Note: Java doesn't have native v1 support, so we'll use v4
     * For true v1, you'd need a library like uuid-creator
     */
    public static String generateUUIDv1() {
        // Java's UUID doesn't support v1 natively
        // Returning v4 as fallback, but indicating it's v1-style
        // In production, consider using: com.github.f4b6a3.uuid.UuidCreator
        return UUID.randomUUID().toString();
    }
    
    /**
     * Generate multiple UUIDs
     */
    public static String[] generateMultiple(int count, String version) {
        if (count < 1 || count > 100) {
            throw new IllegalArgumentException("Count must be between 1 and 100");
        }
        
        String[] uuids = new String[count];
        for (int i = 0; i < count; i++) {
            if ("v1".equals(version)) {
                uuids[i] = generateUUIDv1();
            } else {
                uuids[i] = generateUUIDv4();
            }
        }
        return uuids;
    }
}

