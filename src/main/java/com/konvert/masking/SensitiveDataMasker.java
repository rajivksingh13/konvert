package com.konvert.masking;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SensitiveDataMasker {
    static final Pattern EMAIL_PATTERN = Pattern.compile("\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b", Pattern.CASE_INSENSITIVE);
    static final Pattern EMAIL_DOMAIN_PATTERN = Pattern.compile("(?<![A-Z0-9._%+-])@[A-Z0-9.-]+\\.[A-Z]{2,}\\b", Pattern.CASE_INSENSITIVE);
    static final Pattern SSN_PATTERN = Pattern.compile("\\b\\d{3}-\\d{2}-\\d{4}\\b|\\b\\d{9}\\b");
    static final Pattern CARD_PATTERN = Pattern.compile("\\b(?:\\d[ -]*?){13,19}\\b");
    static final Pattern ACCOUNT_PATTERN = Pattern.compile("\\b(?:\\d[ -]?){8,20}\\b");
    static final Pattern PHONE_PATTERN = Pattern.compile("(?<!\\w)(?:\\+?\\d{1,3}[ -]?)?(?:\\d[ -]?){10,15}(?!\\w)");
    static final Pattern PAN_PATTERN = Pattern.compile("\\b[A-Z]{5}\\d{4}[A-Z]\\b", Pattern.CASE_INSENSITIVE);
    static final Pattern AADHAAR_PATTERN = Pattern.compile("\\b\\d{4}[ -]?\\d{4}[ -]?\\d{4}\\b");
    static final Pattern GSTIN_PATTERN = Pattern.compile("\\b\\d{2}[A-Z]{5}\\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]\\b", Pattern.CASE_INSENSITIVE);
    static final Pattern VAT_PATTERN = Pattern.compile("\\b[A-Z]{2}[A-Z0-9]{8,12}\\b", Pattern.CASE_INSENSITIVE);
    static final Pattern EIN_PATTERN = Pattern.compile("\\b\\d{2}-\\d{7}\\b");
    static final Pattern TIN_LABEL_PATTERN = Pattern.compile("(?i)(\\b(?:tin|tax\\s*id|taxpayer\\s*id)\\b\\s*[:#-]?\\s*)([A-Z0-9-]{6,15})");
    static final Pattern CASE_NUMBER_LABEL_PATTERN = Pattern.compile("(?i)(\\bcase\\s*(?:no|number)?\\b\\s*[:#-]?\\s*)([A-Z0-9\\/-]{4,})");
    static final Pattern CASE_NUMBER_VALUE_PATTERN = Pattern.compile("\\b\\d{2,4}/[A-Z0-9]{2,}/\\d{2,}\\b", Pattern.CASE_INSENSITIVE);
    static final Pattern INVOICE_ID_LABEL_PATTERN = Pattern.compile("(?i)(\\b(?:invoice|inv)\\s*(?:no|number)?\\b\\s*[:#-]?\\s*)([A-Z0-9\\/-]{4,})");
    static final Pattern LEGAL_ID_LABEL_PATTERN = Pattern.compile("(?i)(\\b(?:registration|reg|document|doc|legal)\\s*(?:id|no|number)?\\b\\s*[:#-]?\\s*)([A-Z0-9\\/-]{4,})");
    static final Pattern LICENSE_ID_LABEL_PATTERN = Pattern.compile("(?i)(\\b(?:license|lic)\\s*(?:id|no|number)?\\b\\s*[:#-]?\\s*)([A-Z0-9\\/-]{4,})");
    static final Pattern ADDRESS_LABEL_PATTERN = Pattern.compile("(?i)((?<!\\w)address(?!\\w)\\s*[:#=\\-]\\s*)([^\\r\\n]+)");
    static final Pattern SECRET_PATTERN = Pattern.compile("(?i)(api[_-]?key|secret|token|password)\\s*[:=]\\s*([\"']?)([^\"'\\s]{6,})\\2");

    public static class MaskMatch {
        private final int start;
        private final int end;
        private final String type;

        public MaskMatch(int start, int end, String type) {
            this.start = start;
            this.end = end;
            this.type = type;
        }

        public int getStart() {
            return start;
        }

        public int getEnd() {
            return end;
        }

        public String getType() {
            return type;
        }
    }

    public MaskingOutcome maskText(String input) {
        return maskText(input, EnumSet.allOf(MaskingType.class));
    }

    public MaskingOutcome maskText(String input, Set<MaskingType> types) {
        Map<String, Integer> counts = new HashMap<>();
        for (MaskingType type : MaskingType.values()) {
            counts.put(type.name().toLowerCase(), 0);
        }

        String output = input;

        if (types.contains(MaskingType.EMAIL)) {
            output = replaceEmail(output, counts);
            output = replaceDomainEmail(output, counts);
        }
        if (types.contains(MaskingType.SSN)) {
            output = replaceWithMask(SSN_PATTERN, output, counts, "ssn", raw -> maskDigits(raw, 4));
        }
        if (types.contains(MaskingType.PAN)) {
            output = replaceWithMask(PAN_PATTERN, output, counts, "pan", this::maskPan);
        }
        if (types.contains(MaskingType.AADHAAR)) {
            output = replaceWithMask(AADHAAR_PATTERN, output, counts, "aadhaar", raw -> maskDigits(raw, 4));
        }
        if (types.contains(MaskingType.GSTIN)) {
            output = replaceWithMask(GSTIN_PATTERN, output, counts, "gstin", raw -> maskAlphaNum(raw, 4));
        }
        if (types.contains(MaskingType.VAT)) {
            output = replaceVatValues(output, counts);
        }
        if (types.contains(MaskingType.EIN)) {
            output = replaceWithMask(EIN_PATTERN, output, counts, "ein", raw -> maskDigits(raw, 4));
        }
        if (types.contains(MaskingType.TIN)) {
            output = replaceLabeledValue(TIN_LABEL_PATTERN, output, counts, "tin", raw -> maskAlphaNum(raw, 4));
        }
        if (types.contains(MaskingType.CARD)) {
            output = replaceCardNumbers(output, counts);
        }
        if (types.contains(MaskingType.ACCOUNT)) {
            output = replaceAccountNumbers(output, counts);
        }
        if (types.contains(MaskingType.PHONE)) {
            output = replaceWithMask(PHONE_PATTERN, output, counts, "phone", raw -> maskDigits(raw, 4));
        }
        if (types.contains(MaskingType.CASE_NUMBER)) {
            output = replaceLabeledValue(CASE_NUMBER_LABEL_PATTERN, output, counts, "case_number", raw -> maskAlphaNum(raw, 4));
            output = replaceWithMask(CASE_NUMBER_VALUE_PATTERN, output, counts, "case_number", raw -> maskAlphaNum(raw, 4));
        }
        if (types.contains(MaskingType.INVOICE_ID)) {
            output = replaceLabeledValue(INVOICE_ID_LABEL_PATTERN, output, counts, "invoice_id", raw -> maskAlphaNum(raw, 4));
        }
        if (types.contains(MaskingType.LEGAL_ID)) {
            output = replaceLabeledValue(LEGAL_ID_LABEL_PATTERN, output, counts, "legal_id", this::maskDigitsOnly);
        }
        if (types.contains(MaskingType.LICENSE_ID)) {
            output = replaceLabeledValue(LICENSE_ID_LABEL_PATTERN, output, counts, "license_id", raw -> maskAlphaNum(raw, 4));
        }
        if (types.contains(MaskingType.SECRET)) {
            output = replaceSecrets(output, counts);
        }
        if (types.contains(MaskingType.ADDRESS)) {
            output = replaceLabeledValue(ADDRESS_LABEL_PATTERN, output, counts, "address", raw -> "XXXX");
        }

        int total = counts.values().stream().mapToInt(Integer::intValue).sum();
        return new MaskingOutcome(output, counts, total);
    }

    public MaskingType detectTypeFromKey(String key) {
        if (key == null) {
            return null;
        }
        String normalized = key.toLowerCase();
        if (normalized.contains("email")) return MaskingType.EMAIL;
        if (normalized.contains("phone") || normalized.contains("mobile") || normalized.contains("contact") || normalized.contains("tel")) return MaskingType.PHONE;
        if (normalized.contains("ssn") || normalized.contains("social")) return MaskingType.SSN;
        if (normalized.contains("pan")) return MaskingType.PAN;
        if (normalized.contains("aadhaar") || normalized.contains("aadhar")) return MaskingType.AADHAAR;
        if (normalized.contains("gstin") || normalized.contains("gst")) return MaskingType.GSTIN;
        if (normalized.contains("vat")) return MaskingType.VAT;
        if (normalized.contains("ein")) return MaskingType.EIN;
        if (normalized.contains("tin") || normalized.contains("taxid") || normalized.contains("tax_id") || normalized.contains("taxpayer")) return MaskingType.TIN;
        if (normalized.contains("account") || normalized.contains("acct") || normalized.contains("iban")) return MaskingType.ACCOUNT;
        if (normalized.contains("card") || normalized.contains("credit") || normalized.contains("cc")) return MaskingType.CARD;
        if (normalized.contains("password") || normalized.contains("secret") || normalized.contains("token") || normalized.contains("api_key") || normalized.contains("apikey")) return MaskingType.SECRET;
        if (normalized.contains("address") || normalized.contains("addr")) return MaskingType.ADDRESS;
        if (normalized.contains("invoice") || normalized.contains("inv_") || normalized.contains("inv-") || normalized.contains("inv")) return MaskingType.INVOICE_ID;
        if (normalized.contains("case")) return MaskingType.CASE_NUMBER;
        if (normalized.contains("license") || normalized.contains("licence") || normalized.contains("lic")) return MaskingType.LICENSE_ID;
        if (normalized.contains("legal") || normalized.contains("reg") || normalized.contains("registration") || normalized.contains("doc")) return MaskingType.LEGAL_ID;
        return null;
    }

    public String maskValue(Object value, MaskingType type) {
        if (type == null) {
            return value == null ? null : value.toString();
        }
        String raw = value == null ? "" : value.toString();
        switch (type) {
            case EMAIL:
                return maskEmail(raw);
            case PHONE:
            case SSN:
            case AADHAAR:
            case ACCOUNT:
                return maskDigits(raw, 4);
            case CARD:
                return maskDigits(raw, 4);
            case PAN:
                return maskPan(raw);
            case GSTIN:
            case VAT:
                return maskAlphaNum(raw, 4);
            case EIN:
            case TIN:
                return maskDigits(raw, 4);
            case SECRET:
                return "XXXX";
            case ADDRESS:
                return "XXXX";
            case LEGAL_ID:
                return maskDigitsOnly(raw);
            case CASE_NUMBER:
            case INVOICE_ID:
            case LICENSE_ID:
                return maskAlphaNum(raw, 4);
            default:
                return "XXXX";
        }
    }

    public List<MaskMatch> findMatches(String input) {
        List<MaskMatch> matches = new ArrayList<>();
        addMatches(EMAIL_PATTERN, input, "email", matches);
        addMatches(SSN_PATTERN, input, "ssn", matches);
        addMatches(GSTIN_PATTERN, input, "gstin", matches);
        addMatches(VAT_PATTERN, input, "vat", matches);
        addMatches(EIN_PATTERN, input, "ein", matches);
        addMatches(ACCOUNT_PATTERN, input, "account", matches);
        addMatches(PHONE_PATTERN, input, "phone", matches);
        addMatches(PAN_PATTERN, input, "pan", matches);
        addMatches(AADHAAR_PATTERN, input, "aadhaar", matches);
        addGroupMatches(CASE_NUMBER_LABEL_PATTERN, input, 2, "case_number", matches);
        addGroupMatches(INVOICE_ID_LABEL_PATTERN, input, 2, "invoice_id", matches);
        addGroupMatches(LEGAL_ID_LABEL_PATTERN, input, 2, "legal_id", matches);
        addGroupMatches(LICENSE_ID_LABEL_PATTERN, input, 2, "license_id", matches);
        addGroupMatches(TIN_LABEL_PATTERN, input, 2, "tin", matches);

        Matcher cardMatcher = CARD_PATTERN.matcher(input);
        while (cardMatcher.find()) {
            String raw = cardMatcher.group();
            String digits = raw.replaceAll("[^0-9]", "");
            if (isValidCard(digits)) {
                matches.add(new MaskMatch(cardMatcher.start(), cardMatcher.end(), "card"));
            }
        }

        Matcher secretMatcher = SECRET_PATTERN.matcher(input);
        while (secretMatcher.find()) {
            int valueStart = secretMatcher.start(3);
            int valueEnd = secretMatcher.end(3);
            matches.add(new MaskMatch(valueStart, valueEnd, "secret"));
        }

        return matches;
    }

    private void addMatches(Pattern pattern, String input, String type, List<MaskMatch> matches) {
        Matcher matcher = pattern.matcher(input);
        while (matcher.find()) {
            matches.add(new MaskMatch(matcher.start(), matcher.end(), type));
        }
    }

    private void addGroupMatches(Pattern pattern, String input, int group, String type, List<MaskMatch> matches) {
        Matcher matcher = pattern.matcher(input);
        while (matcher.find()) {
            int start = matcher.start(group);
            int end = matcher.end(group);
            if (start >= 0 && end > start) {
                matches.add(new MaskMatch(start, end, type));
            }
        }
    }

    private String replaceWithMask(Pattern pattern, String input, Map<String, Integer> counts, String key, java.util.function.Function<String, String> masker) {
        Matcher matcher = pattern.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String raw = matcher.group();
            matcher.appendReplacement(sb, Matcher.quoteReplacement(masker.apply(raw)));
            counts.put(key, counts.get(key) + 1);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String replaceVatValues(String input, Map<String, Integer> counts) {
        Matcher matcher = VAT_PATTERN.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String raw = matcher.group();
            if (!raw.matches(".*\\d.*")) {
                matcher.appendReplacement(sb, Matcher.quoteReplacement(raw));
                continue;
            }
            matcher.appendReplacement(sb, Matcher.quoteReplacement(maskAlphaNum(raw, 4)));
            counts.put("vat", counts.get("vat") + 1);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String replaceLabeledValue(Pattern pattern, String input, Map<String, Integer> counts, String key, java.util.function.Function<String, String> masker) {
        Matcher matcher = pattern.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String prefix = matcher.group(1);
            String value = matcher.group(2);
            matcher.appendReplacement(sb, Matcher.quoteReplacement(prefix + masker.apply(value)));
            counts.put(key, counts.get(key) + 1);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String replaceEmail(String input, Map<String, Integer> counts) {
        Matcher matcher = EMAIL_PATTERN.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String raw = matcher.group();
            matcher.appendReplacement(sb, Matcher.quoteReplacement(maskEmail(raw)));
            counts.put("email", counts.get("email") + 1);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String replaceDomainEmail(String input, Map<String, Integer> counts) {
        Matcher matcher = EMAIL_DOMAIN_PATTERN.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String raw = matcher.group();
            matcher.appendReplacement(sb, Matcher.quoteReplacement(maskEmail(raw)));
            counts.put("email", counts.get("email") + 1);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String replaceCardNumbers(String input, Map<String, Integer> counts) {
        Matcher matcher = CARD_PATTERN.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String raw = matcher.group();
            String digits = raw.replaceAll("[^0-9]", "");
            if (isValidCard(digits)) {
                matcher.appendReplacement(sb, Matcher.quoteReplacement(maskDigits(raw, 4)));
                counts.put("card", counts.get("card") + 1);
            } else {
                matcher.appendReplacement(sb, Matcher.quoteReplacement(raw));
            }
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String replaceAccountNumbers(String input, Map<String, Integer> counts) {
        Matcher matcher = ACCOUNT_PATTERN.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String raw = matcher.group();
            if (PHONE_PATTERN.matcher(raw).matches()) {
                matcher.appendReplacement(sb, Matcher.quoteReplacement(raw));
                continue;
            }
            matcher.appendReplacement(sb, Matcher.quoteReplacement(maskDigits(raw, 4)));
            counts.put("account", counts.get("account") + 1);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String replaceSecrets(String input, Map<String, Integer> counts) {
        Matcher matcher = SECRET_PATTERN.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String key = matcher.group(1);
            String quote = matcher.group(2);
            String value = matcher.group(3);
            String masked = maskAlphaNum(value, 0);
            matcher.appendReplacement(sb, Matcher.quoteReplacement(key + ": " + quote + masked + quote));
            counts.put("secret", counts.get("secret") + 1);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String maskEmail(String raw) {
        if (raw == null || raw.isEmpty()) {
            return raw;
        }
        StringBuilder masked = new StringBuilder(raw.length());
        for (int i = 0; i < raw.length(); i++) {
            char c = raw.charAt(i);
            if (Character.isLetterOrDigit(c)) {
                masked.append('X');
            } else {
                masked.append(c);
            }
        }
        return masked.toString();
    }

    private String maskPan(String raw) {
        String upper = raw.toUpperCase();
        if (upper.length() != 10) {
            return "XXXX";
        }
        return "XXXXX" + upper.substring(5);
    }

    private String maskDigits(String raw, int keepLast) {
        int digitCount = 0;
        char[] chars = raw.toCharArray();
        for (char c : chars) {
            if (Character.isDigit(c)) {
                digitCount++;
            }
        }
        int toMask = Math.max(0, digitCount - keepLast);
        for (int i = 0; i < chars.length; i++) {
            if (Character.isDigit(chars[i]) && toMask > 0) {
                chars[i] = 'X';
                toMask--;
            }
        }
        return new String(chars);
    }

    private String maskAlphaNum(String raw, int keepLast) {
        int count = 0;
        char[] chars = raw.toCharArray();
        for (char c : chars) {
            if (Character.isLetterOrDigit(c)) {
                count++;
            }
        }
        int toMask = Math.max(0, count - keepLast);
        for (int i = 0; i < chars.length; i++) {
            if (Character.isLetterOrDigit(chars[i]) && toMask > 0) {
                chars[i] = 'X';
                toMask--;
            }
        }
        return new String(chars);
    }

    private String maskDigitsOnly(String raw) {
        char[] chars = raw.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            if (Character.isDigit(chars[i])) {
                chars[i] = 'X';
            }
        }
        return new String(chars);
    }

    public String maskGeneric(String raw) {
        if (raw == null || raw.isEmpty()) {
            return raw;
        }
        return maskAlphaNum(raw, 0);
    }

    private boolean isValidCard(String digits) {
        if (digits.length() < 13 || digits.length() > 19) {
            return false;
        }
        int sum = 0;
        boolean alternate = false;
        for (int i = digits.length() - 1; i >= 0; i--) {
            int n = digits.charAt(i) - '0';
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        return sum % 10 == 0;
    }
}
