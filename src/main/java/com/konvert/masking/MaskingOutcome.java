package com.konvert.masking;

import java.util.Map;

public class MaskingOutcome {
    private final String text;
    private final Map<String, Integer> counts;
    private final int total;

    public MaskingOutcome(String text, Map<String, Integer> counts, int total) {
        this.text = text;
        this.counts = counts;
        this.total = total;
    }

    public String getText() {
        return text;
    }

    public Map<String, Integer> getCounts() {
        return counts;
    }

    public int getTotal() {
        return total;
    }
}
