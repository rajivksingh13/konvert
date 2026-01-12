package com.konvertr.tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

import static io.restassured.RestAssured.given;

/**
 * Base test class with common utilities and setup
 */
public abstract class BaseTest {
    
    protected static final String API_BASE_URL = "http://localhost:8080/api";
    // Path relative to backend-tests directory
    protected static final String TEST_DATA_BASE = "../../test-samples";
    protected static ObjectMapper jsonMapper = new ObjectMapper();
    protected static ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
    
    @BeforeAll
    public static void setup() {
        RestAssured.baseURI = API_BASE_URL;
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
        
        // Wait for application to be ready
        waitForApplication();
    }
    
    @BeforeEach
    public void reset() {
        // Reset any state if needed
    }
    
    /**
     * Wait for application to be ready
     */
    private static void waitForApplication() {
        int maxAttempts = 30;
        int attempt = 0;
        
        while (attempt < maxAttempts) {
            try {
                Response response = given()
                    .get("http://localhost:8080");
                
                if (response.getStatusCode() == 200) {
                    System.out.println("âœ… Application is ready");
                    return;
                }
            } catch (Exception e) {
                // Application not ready yet
            }
            
            attempt++;
            try {
                Thread.sleep(1000); // Wait 1 second
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        
        throw new RuntimeException("Application did not start within 30 seconds");
    }
    
    /**
     * Load test file content
     */
    protected String loadTestFile(String relativePath) {
        try {
            // Try multiple possible paths
            java.nio.file.Path testPath = null;
            
            // Path 1: Relative to backend-tests directory
            testPath = Paths.get(TEST_DATA_BASE, relativePath);
            if (!Files.exists(testPath)) {
                // Path 2: Relative to project root (when running from Maven)
                testPath = Paths.get("../../test-samples", relativePath);
            }
            if (!Files.exists(testPath)) {
                // Path 3: Absolute from project root
                String projectRoot = System.getProperty("user.dir");
                if (projectRoot.contains("backend-tests")) {
                    projectRoot = Paths.get(projectRoot, "..", "..").normalize().toString();
                }
                testPath = Paths.get(projectRoot, "test-samples", relativePath);
            }
            
            if (!Files.exists(testPath)) {
                throw new IOException("Test file not found: " + relativePath + 
                    " (tried: " + TEST_DATA_BASE + "/" + relativePath + ")");
            }
            
            return Files.readString(testPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load test file: " + relativePath + 
                " - " + e.getMessage(), e);
        }
    }
    
    /**
     * Parse JSON string to Map
     */
    protected Map<String, Object> parseJson(String json) {
        try {
            return jsonMapper.readValue(json, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON", e);
        }
    }
    
    /**
     * Parse YAML string to Map
     */
    protected Map<String, Object> parseYaml(String yaml) {
        try {
            return yamlMapper.readValue(yaml, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse YAML", e);
        }
    }
    
    /**
     * Convert Map to JSON string
     */
    protected String toJson(Map<String, Object> map) {
        try {
            return jsonMapper.writeValueAsString(map);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert to JSON", e);
        }
    }
    
    /**
     * Verify API response is successful
     */
    protected void verifySuccess(Response response) {
        if (response.getStatusCode() != 200) {
            throw new AssertionError("Expected status 200, got " + response.getStatusCode());
        }
        Boolean success = response.jsonPath().getBoolean("success");
        if (success == null || !success) {
            throw new AssertionError("Expected success=true, but got: " + success);
        }
    }
    
    /**
     * Verify API response has error
     */
    protected void verifyError(Response response, int expectedStatus) {
        if (response.getStatusCode() != expectedStatus) {
            throw new AssertionError("Expected status " + expectedStatus + ", got " + response.getStatusCode());
        }
        Boolean success = response.jsonPath().getBoolean("success");
        if (success != null && success) {
            throw new AssertionError("Expected success=false, but got: " + success);
        }
    }
}

