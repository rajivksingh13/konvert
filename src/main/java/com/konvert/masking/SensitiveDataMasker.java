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
    static final Pattern SSN_PATTERN = Pattern.compile("\\b\\d{3}-\\d{2}-\\d{4}\\b|\\b\\d{9}\\b");
    static final Pattern CARD_PATTERN = Pattern.compile("\\b(?:\\d[ -]*?){13,19}\\b");
    static final Pattern ACCOUNT_PATTERN = Pattern.compile("\\b(?:\\d[ -]?){8,20}\\b");
    static final Pattern PHONE_PATTERN = Pattern.compile("\\b(?:\\+?\\d{1,3}[ -]?)?(?:\\d[ -]?){10,15}\\b");
    static final Pattern PAN_PATTERN = Pattern.compile("\\b[A-Z]{5}\\d{4}[A-Z]\\b", Pattern.CASE_INSENSITIVE);
    static final Pattern AADHAAR_PATTERN = Pattern.compile("\\b\\d{4}[ -]?\\d{4}[ -]?\\d{4}\\b");
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
        }
        if (types.contains(MaskingType.SSN)) {
            output = replaceWithMask(SSN_PATTERN, output, counts, "ssn", raw -> maskDigits(raw, 4));
        }
        if (types.contains(MaskingType.CARD)) {
            output = replaceCardNumbers(output, counts);
        }
        if (types.contains(MaskingType.ACCOUNT)) {
            output = replaceWithMask(ACCOUNT_PATTERN, output, counts, "account", raw -> maskDigits(raw, 4));
        }
        if (types.contains(MaskingType.PHONE)) {
            output = replaceWithMask(PHONE_PATTERN, output, counts, "phone", raw -> maskDigits(raw, 4));
        }
        if (types.contains(MaskingType.PAN)) {
            output = replaceWithMask(PAN_PATTERN, output, counts, "pan", this::maskPan);
        }
        if (types.contains(MaskingType.AADHAAR)) {
            output = replaceWithMask(AADHAAR_PATTERN, output, counts, "aadhaar", raw -> maskDigits(raw, 4));
        }
        if (types.contains(MaskingType.SECRET)) {
            output = replaceSecrets(output, counts);
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
        if (normalized.contains("account") || normalized.contains("acct") || normalized.contains("iban")) return MaskingType.ACCOUNT;
        if (normalized.contains("card") || normalized.contains("credit") || normalized.contains("cc")) return MaskingType.CARD;
        if (normalized.contains("password") || normalized.contains("secret") || normalized.contains("token") || normalized.contains("api_key") || normalized.contains("apikey")) return MaskingType.SECRET;
        if (normalized.contains("address") || normalized.contains("addr")) return MaskingType.ADDRESS;
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
            case SECRET:
                return "XXXX";
            case ADDRESS:
                return "XXXX";
            default:
                return "XXXX";
        }
    }

    public List<MaskMatch> findMatches(String input) {
        List<MaskMatch> matches = new ArrayList<>();
        addMatches(EMAIL_PATTERN, input, "email", matches);
        addMatches(SSN_PATTERN, input, "ssn", matches);
        addMatches(ACCOUNT_PATTERN, input, "account", matches);
        addMatches(PHONE_PATTERN, input, "phone", matches);
        addMatches(PAN_PATTERN, input, "pan", matches);
        addMatches(AADHAAR_PATTERN, input, "aadhaar", matches);

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

    private String replaceSecrets(String input, Map<String, Integer> counts) {
        Matcher matcher = SECRET_PATTERN.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String key = matcher.group(1);
            String quote = matcher.group(2);
            matcher.appendReplacement(sb, Matcher.quoteReplacement(key + ": " + quote + "XXXX" + quote));
            counts.put("secret", counts.get("secret") + 1);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String maskEmail(String raw) {
        int at = raw.indexOf('@');
        if (at <= 1) {
            return "XXXX";
        }
        String local = raw.substring(0, at);
        String domain = raw.substring(at);
        if (local.length() <= 2) {
            return "XX" + domain;
        }
        String first = local.substring(0, 1);
        String last = local.substring(local.length() - 1);
        return first + "XXXX" + last + domain;
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
