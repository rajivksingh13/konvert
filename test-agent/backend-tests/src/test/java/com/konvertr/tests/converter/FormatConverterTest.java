package com.konvertr.tests.converter;

import com.konvertr.tests.BaseTest;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for format conversion endpoints
 */
@DisplayName("Format Conversion Tests")
public class FormatConverterTest extends BaseTest {
    
    @Test
    @DisplayName("JSON to YAML conversion - basic")
    public void testJsonToYamlBasic() {
        String jsonInput = loadTestFile("minimal.json");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", jsonInput,
                "fromFormat", "json",
                "toFormat", "yaml"
            ))
            .post("/convert");
        
        verifySuccess(response);
        String yamlOutput = response.jsonPath().getString("output");
        assertThat(yamlOutput).isNotNull();
        assertThat(yamlOutput).contains("key:");
        assertThat(yamlOutput).contains("value");
    }
    
    @Test
    @DisplayName("JSON to YAML conversion - complex nested structure")
    public void testJsonToYamlComplex() {
        String jsonInput = loadTestFile("complex.json");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", jsonInput,
                "fromFormat", "json",
                "toFormat", "yaml"
            ))
            .post("/convert");
        
        verifySuccess(response);
        String yamlOutput = response.jsonPath().getString("output");
        assertThat(yamlOutput).isNotNull();
        
        // Verify YAML is valid
        Map<String, Object> parsed = parseYaml(yamlOutput);
        assertThat(parsed).isNotNull();
    }
    
    @Test
    @DisplayName("YAML to JSON conversion")
    public void testYamlToJson() {
        String yamlInput = loadTestFile("minimal.yaml");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", yamlInput,
                "fromFormat", "yaml",
                "toFormat", "json"
            ))
            .post("/convert");
        
        // Check response status and log error if failed
        if (response.getStatusCode() != 200) {
            String error = response.jsonPath().getString("error");
            System.err.println("YAML to JSON conversion failed with status " + response.getStatusCode() + 
                             ", error: " + error);
        }
        
        verifySuccess(response);
        String jsonOutput = response.jsonPath().getString("output");
        assertThat(jsonOutput).isNotNull();
        
        // Verify JSON is valid
        Map<String, Object> parsed = parseJson(jsonOutput);
        assertThat(parsed).isNotNull();
    }
    
    @Test
    @DisplayName("JSON to XML conversion")
    public void testJsonToXml() {
        String jsonInput = loadTestFile("minimal.json");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", jsonInput,
                "fromFormat", "json",
                "toFormat", "xml"
            ))
            .post("/convert");
        
        verifySuccess(response);
        String xmlOutput = response.jsonPath().getString("output");
        assertThat(xmlOutput).isNotNull();
        assertThat(xmlOutput).contains("<?xml");
        assertThat(xmlOutput).contains("<data>");
    }
    
    @Test
    @DisplayName("JSON to TOML conversion")
    public void testJsonToToml() {
        String jsonInput = loadTestFile("minimal.json");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", jsonInput,
                "fromFormat", "json",
                "toFormat", "toml"
            ))
            .post("/convert");
        
        verifySuccess(response);
        String tomlOutput = response.jsonPath().getString("output");
        assertThat(tomlOutput).isNotNull();
    }
    
    @Test
    @DisplayName("JSON to YAML roundtrip - data integrity")
    public void testJsonToYamlRoundtrip() {
        String originalJson = loadTestFile("complex.json");
        
        // Convert JSON to YAML
        Response yamlResponse = given()
            .contentType("application/json")
            .body(Map.of(
                "input", originalJson,
                "fromFormat", "json",
                "toFormat", "yaml"
            ))
            .post("/convert");
        
        verifySuccess(yamlResponse);
        String yamlOutput = yamlResponse.jsonPath().getString("output");
        
        // Convert YAML back to JSON
        Response jsonResponse = given()
            .contentType("application/json")
            .body(Map.of(
                "input", yamlOutput,
                "fromFormat", "yaml",
                "toFormat", "json"
            ))
            .post("/convert");
        
        verifySuccess(jsonResponse);
        String roundtripJson = jsonResponse.jsonPath().getString("output");
        
        // Parse and compare (ignoring formatting differences)
        Map<String, Object> original = parseJson(originalJson);
        Map<String, Object> roundtrip = parseJson(roundtripJson);
        
        // Basic structure comparison
        assertThat(roundtrip.keySet()).containsAll(original.keySet());
    }
    
    @Test
    @DisplayName("Invalid JSON input - should return error")
    public void testInvalidJsonInput() {
        String invalidJson = "{ invalid json }";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", invalidJson,
                "fromFormat", "json",
                "toFormat", "yaml"
            ))
            .post("/convert");
        
        verifyError(response, 500);
        String error = response.jsonPath().getString("error");
        assertThat(error).isNotNull();
    }
    
    @Test
    @DisplayName("Empty input - should return error")
    public void testEmptyInput() {
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", "",
                "fromFormat", "json",
                "toFormat", "yaml"
            ))
            .post("/convert");
        
        verifyError(response, 400);
    }
    
    @Test
    @DisplayName("Missing format parameters - should return error")
    public void testMissingFormats() {
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", loadTestFile("minimal.json")
            ))
            .post("/convert");
        
        verifyError(response, 400);
    }
}

