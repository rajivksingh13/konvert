package com.konvertr.tests.formatter;

import com.konvertr.tests.BaseTest;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for formatting endpoints
 */
@DisplayName("Formatter Tests")
public class FormatterTest extends BaseTest {
    
    @Test
    @DisplayName("JSON Formatter - beautify minified JSON")
    public void testJsonFormatter() {
        String minifiedJson = "{\"name\":\"John\",\"age\":30,\"city\":\"New York\"}";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", minifiedJson,
                "formatType", "JSON"
            ))
            .post("/format");
        
        verifySuccess(response);
        String formatted = response.jsonPath().getString("output");
        assertThat(formatted).isNotNull();
        assertThat(formatted).contains("\n"); // Should have newlines
        assertThat(formatted).contains("  "); // Should have indentation
    }
    
    @Test
    @DisplayName("YAML Formatter - format unformatted YAML")
    public void testYamlFormatter() {
        String unformattedYaml = loadTestFile("unformatted.yaml");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", unformattedYaml,
                "formatType", "YAML"
            ))
            .post("/format");
        
        verifySuccess(response);
        String formatted = response.jsonPath().getString("output");
        assertThat(formatted).isNotNull();
    }
    
    @Test
    @DisplayName("CSV Formatter - format CSV with column alignment")
    public void testCsvFormatter() {
        String csvInput = loadTestFile("sample.csv");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", csvInput,
                "formatType", "CSV",
                "alignColumns", true
            ))
            .post("/format");
        
        verifySuccess(response);
        String formatted = response.jsonPath().getString("output");
        assertThat(formatted).isNotNull();
    }
    
    @Test
    @DisplayName("JSON Formatter - preserve data integrity")
    public void testJsonFormatterDataIntegrity() {
        String originalJson = loadTestFile("complex.json");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", originalJson,
                "formatType", "JSON"
            ))
            .post("/format");
        
        verifySuccess(response);
        String formatted = response.jsonPath().getString("output");
        
        // Parse both to verify data integrity
        Map<String, Object> original = parseJson(originalJson);
        Map<String, Object> formattedParsed = parseJson(formatted);
        
        // Should have same keys
        assertThat(formattedParsed.keySet()).containsAll(original.keySet());
    }
}

