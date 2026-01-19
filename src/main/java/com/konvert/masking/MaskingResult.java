package com.konvert.masking;

import java.util.Map;

public class MaskingResult {
    private byte[] outputBytes;
    private String outputText;
    private String outputFilename;
    private String detectedFormat;
    private int maskedCount;
    private Map<String, Integer> counts;
    private String warning;

    public MaskingResult(byte[] outputBytes, String outputText, String outputFilename, String detectedFormat, int maskedCount, Map<String, Integer> counts, String warning) {
        this.outputBytes = outputBytes;
        this.outputText = outputText;
        this.outputFilename = outputFilename;
        this.detectedFormat = detectedFormat;
        this.maskedCount = maskedCount;
        this.counts = counts;
        this.warning = warning;
    }

    public byte[] getOutputBytes() {
        return outputBytes;
    }

    public String getOutputText() {
        return outputText;
    }

    public String getOutputFilename() {
        return outputFilename;
    }

    public String getDetectedFormat() {
        return detectedFormat;
    }

    public int getMaskedCount() {
        return maskedCount;
    }

    public Map<String, Integer> getCounts() {
        return counts;
    }

    public String getWarning() {
        return warning;
    }
}
