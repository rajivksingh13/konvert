package com.konvert.util;

import com.konvert.FormatConverter;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Utility class for calculating TOON format statistics and token analysis.
 * Provides metrics comparing TOON format efficiency against other formats.
 */
public class ToonStatisticsUtil {
    
    /**
     * Analyzes TOON efficiency by comparing original format with TOON format.
     * Calculates token counts, size metrics, and reduction percentages.
     * 
     * @param originalInput The original data in the source format
     * @param originalFormat The source format (json, yaml, xml, etc.)
     * @param toonOutput The converted TOON format output
     * @return Map containing all statistics and metrics
     */
    public static Map<String, Object> analyzeToonEfficiency(
            String originalInput,
            String originalFormat,
            String toonOutput) {
        
        Map<String, Object> stats = new LinkedHashMap<>();
        
        try {
            // Calculate token counts (estimated)
            int originalTokens = estimateTokens(originalInput);
            int toonTokens = estimateTokens(toonOutput);
            
            // Calculate size metrics
            int originalSize = originalInput.length();
            int toonSize = toonOutput.length();
            
            // Calculate line counts
            int originalLines = countLines(originalInput);
            int toonLines = countLines(toonOutput);
            
            // Calculate reductions
            int tokenReduction = originalTokens - toonTokens;
            double tokenReductionPercent = originalTokens > 0 
                ? (tokenReduction / (double) originalTokens) * 100.0 
                : 0.0;
            
            int sizeReduction = originalSize - toonSize;
            double sizeReductionPercent = originalSize > 0 
                ? (sizeReduction / (double) originalSize) * 100.0 
                : 0.0;
            
            int lineReduction = originalLines - toonLines;
            double lineReductionPercent = originalLines > 0 
                ? (lineReduction / (double) originalLines) * 100.0 
                : 0.0;
            
            // Calculate efficiency metrics
            double compressionRatio = originalSize > 0 
                ? (double) toonSize / originalSize 
                : 1.0;
            
            // Build response structure
            Map<String, Object> originalStats = new LinkedHashMap<>();
            originalStats.put("tokens", originalTokens);
            originalStats.put("size", originalSize);
            originalStats.put("lines", originalLines);
            
            Map<String, Object> toonStats = new LinkedHashMap<>();
            toonStats.put("tokens", toonTokens);
            toonStats.put("size", toonSize);
            toonStats.put("lines", toonLines);
            
            Map<String, Object> reduction = new LinkedHashMap<>();
            reduction.put("tokens", tokenReduction);
            reduction.put("tokensPercent", Math.round(tokenReductionPercent * 100.0) / 100.0);
            reduction.put("size", sizeReduction);
            reduction.put("sizePercent", Math.round(sizeReductionPercent * 100.0) / 100.0);
            reduction.put("lines", lineReduction);
            reduction.put("linesPercent", Math.round(lineReductionPercent * 100.0) / 100.0);
            
            Map<String, Object> efficiency = new LinkedHashMap<>();
            efficiency.put("compressionRatio", Math.round(compressionRatio * 1000.0) / 1000.0);
            efficiency.put("tokenEfficiency", Math.round((1.0 - compressionRatio) * 10000.0) / 100.0);
            
            // Calculate cost projections for popular LLM providers
            Map<String, Object> costProjections = calculateCostProjections(originalTokens, toonTokens, tokenReduction);
            
            stats.put("success", true);
            stats.put("originalFormat", originalFormat);
            stats.put("originalStats", originalStats);
            stats.put("toonStats", toonStats);
            stats.put("reduction", reduction);
            stats.put("efficiency", efficiency);
            stats.put("costProjections", costProjections);
            
        } catch (Exception e) {
            stats.put("success", false);
            stats.put("error", "Failed to calculate statistics: " + e.getMessage());
        }
        
        return stats;
    }
    
    /**
     * Estimates token count based on character count.
     * Uses conservative estimation: ~4 characters per token (common for most LLM models).
     * 
     * @param text The text to estimate tokens for
     * @return Estimated token count
     */
    private static int estimateTokens(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }
        // Conservative estimation: ~4 characters per token
        // This works well for most LLM models (GPT, Claude, etc.)
        return (int) Math.ceil(text.length() / 4.0);
    }
    
    /**
     * Counts the number of lines in the text.
     * 
     * @param text The text to count lines in
     * @return Number of lines
     */
    private static int countLines(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }
        int lines = 1;
        for (char c : text.toCharArray()) {
            if (c == '\n') {
                lines++;
            }
        }
        return lines;
    }
    
    /**
     * Analyzes TOON efficiency from original format input.
     * Converts the input to TOON and then calculates statistics.
     * 
     * @param originalInput The original data in the source format
     * @param originalFormat The source format (json, yaml, xml, etc.)
     * @return Map containing all statistics and metrics
     */
    public static Map<String, Object> analyzeFromOriginal(
            String originalInput,
            String originalFormat) {
        
        try {
            // Convert to TOON
            String toonOutput = FormatConverter.convert(originalInput, originalFormat, "toon", null);
            
            // Calculate statistics
            return analyzeToonEfficiency(originalInput, originalFormat, toonOutput);
            
        } catch (Exception e) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("success", false);
            error.put("error", "Failed to convert to TOON: " + e.getMessage());
            return error;
        }
    }
    
    /**
     * Calculates cost projections for popular LLM providers based on token reduction.
     * Provides estimates for common models to help users understand cost savings.
     * 
     * @param originalTokens Original format token count
     * @param toonTokens TOON format token count
     * @param tokenReduction Number of tokens saved
     * @return Map containing cost projections for different LLM providers
     */
    private static Map<String, Object> calculateCostProjections(
            int originalTokens, 
            int toonTokens, 
            int tokenReduction) {
        
        Map<String, Object> costProjections = new LinkedHashMap<>();
        
        // Popular LLM pricing (as of 2024) - per 1M tokens
        // Using average pricing (input/output combined) for cost estimates
        // Note: Actual pricing varies by provider and model version
        
        // OpenAI GPT-4 (approximate average: $30 input + $60 output / 2)
        double gpt4AvgPrice = 45.0;
        
        // OpenAI GPT-3.5 Turbo (approximate average)
        double gpt35AvgPrice = 1.75;
        
        // Anthropic Claude 3 Opus (approximate average: $15 input + $75 output / 2)
        double claude3OpusAvgPrice = 45.0;
        
        // Anthropic Claude 3 Sonnet (approximate average: $3 input + $15 output / 2)
        double claude3SonnetAvgPrice = 9.0;
        
        // Anthropic Claude 3 Haiku (most cost-effective: $0.25 input + $1.25 output / 2)
        double claude3HaikuAvgPrice = 0.75;
        
        // Calculate costs per 1K requests (assuming same data sent 1000 times)
        int requests = 1000;
        
        // GPT-4 projections
        Map<String, Object> gpt4Costs = calculateProviderCosts(
            "GPT-4", originalTokens, toonTokens, tokenReduction, 
            gpt4AvgPrice, requests);
        costProjections.put("gpt4", gpt4Costs);
        
        // GPT-3.5 Turbo projections
        Map<String, Object> gpt35Costs = calculateProviderCosts(
            "GPT-3.5 Turbo", originalTokens, toonTokens, tokenReduction, 
            gpt35AvgPrice, requests);
        costProjections.put("gpt35", gpt35Costs);
        
        // Claude 3 Opus projections
        Map<String, Object> claudeOpusCosts = calculateProviderCosts(
            "Claude 3 Opus", originalTokens, toonTokens, tokenReduction, 
            claude3OpusAvgPrice, requests);
        costProjections.put("claudeOpus", claudeOpusCosts);
        
        // Claude 3 Sonnet projections
        Map<String, Object> claudeSonnetCosts = calculateProviderCosts(
            "Claude 3 Sonnet", originalTokens, toonTokens, tokenReduction, 
            claude3SonnetAvgPrice, requests);
        costProjections.put("claudeSonnet", claudeSonnetCosts);
        
        // Claude 3 Haiku projections
        Map<String, Object> claudeHaikuCosts = calculateProviderCosts(
            "Claude 3 Haiku", originalTokens, toonTokens, tokenReduction, 
            claude3HaikuAvgPrice, requests);
        costProjections.put("claudeHaiku", claudeHaikuCosts);
        
        // General cost savings explanation
        Map<String, Object> explanation = new LinkedHashMap<>();
        explanation.put("perRequestTokensSaved", tokenReduction);
        explanation.put("tokenReductionPercent", tokenReduction > 0 && originalTokens > 0 
            ? Math.round((tokenReduction / (double) originalTokens) * 10000.0) / 100.0 
            : 0.0);
        explanation.put("monthlySavingsEstimate", tokenReduction > 0 && originalTokens > 0
            ? "For 10K requests/month: $" + String.format("%.2f", 
                (tokenReduction * 10000.0 * gpt4AvgPrice) / 1000000.0)
            : "$0.00");
        
        costProjections.put("explanation", explanation);
        
        return costProjections;
    }
    
    /**
     * Calculates cost projections for a specific LLM provider.
     * 
     * @param providerName Name of the LLM provider/model
     * @param originalTokens Original token count
     * @param toonTokens TOON token count
     * @param tokenReduction Tokens saved
     * @param pricePerMillion Price per million tokens
     * @param requests Number of requests for projection
     * @return Map with cost calculations
     */
    private static Map<String, Object> calculateProviderCosts(
            String providerName,
            int originalTokens,
            int toonTokens,
            int tokenReduction,
            double pricePerMillion,
            int requests) {
        
        Map<String, Object> costs = new LinkedHashMap<>();
        
        // Cost per single request
        double originalCostPerRequest = (originalTokens * pricePerMillion) / 1000000.0;
        double toonCostPerRequest = (toonTokens * pricePerMillion) / 1000000.0;
        double savingsPerRequest = originalCostPerRequest - toonCostPerRequest;
        
        // Cost for projected number of requests
        double originalCostTotal = originalCostPerRequest * requests;
        double toonCostTotal = toonCostPerRequest * requests;
        double savingsTotal = originalCostTotal - toonCostTotal;
        
        // Monthly projection (assuming 10K requests/month)
        int monthlyRequests = 10000;
        double monthlyOriginalCost = originalCostPerRequest * monthlyRequests;
        double monthlyToonCost = toonCostPerRequest * monthlyRequests;
        double monthlySavings = monthlyOriginalCost - monthlyToonCost;
        
        // Yearly projection
        double yearlySavings = monthlySavings * 12;
        
        costs.put("providerName", providerName);
        costs.put("pricePerMillion", pricePerMillion);
        costs.put("costPerRequest", Math.round(originalCostPerRequest * 1000000.0) / 1000000.0);
        costs.put("toonCostPerRequest", Math.round(toonCostPerRequest * 1000000.0) / 1000000.0);
        costs.put("savingsPerRequest", Math.round(savingsPerRequest * 1000000.0) / 1000000.0);
        costs.put("savingsPer1000Requests", Math.round(savingsTotal * 100.0) / 100.0);
        costs.put("monthlySavings", Math.round(monthlySavings * 100.0) / 100.0);
        costs.put("yearlySavings", Math.round(yearlySavings * 100.0) / 100.0);
        costs.put("savingsPercent", originalCostPerRequest > 0 
            ? Math.round((savingsPerRequest / originalCostPerRequest) * 10000.0) / 100.0 
            : 0.0);
        
        return costs;
    }
}



