package com.konvert.masking;

import java.util.Arrays;
import java.util.Locale;
import java.util.Optional;

public enum MaskingType {
    EMAIL,
    PHONE,
    SSN,
    PAN,
    AADHAAR,
    CARD,
    ACCOUNT,
    SECRET,
    ADDRESS;

    public static Optional<MaskingType> fromString(String value) {
        if (value == null || value.isBlank()) {
            return Optional.empty();
        }
        String normalized = value.trim().toUpperCase(Locale.ROOT).replace('-', '_');
        return Arrays.stream(values())
                .filter(type -> type.name().equals(normalized))
                .findFirst();
    }
}
