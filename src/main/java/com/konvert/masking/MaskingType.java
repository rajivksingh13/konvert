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
    GSTIN,
    VAT,
    EIN,
    TIN,
    CARD,
    ACCOUNT,
    SECRET,
    ADDRESS,
    LEGAL_ID,
    CASE_NUMBER,
    INVOICE_ID,
    LICENSE_ID;

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
