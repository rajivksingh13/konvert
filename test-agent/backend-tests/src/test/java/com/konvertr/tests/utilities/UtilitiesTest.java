package com.konvertr.tests.utilities;

import com.konvertr.tests.BaseTest;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for utility endpoints
 */
@DisplayName("Utilities Tests")
public class UtilitiesTest extends BaseTest {
    
    @Test
    @DisplayName("Base64 Encode")
    public void testBase64Encode() {
        String input = "Hello, World!";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of("input", input))
            .post("/base64/encode");
        
        verifySuccess(response);
        String encoded = response.jsonPath().getString("output");
        assertThat(encoded).isNotNull();
        assertThat(encoded).matches("^[A-Za-z0-9+/=]+$"); // Base64 pattern
    }
    
    @Test
    @DisplayName("Base64 Encode/Decode Roundtrip")
    public void testBase64Roundtrip() {
        String original = "Hello, World!";
        
        // Encode
        Response encodeResponse = given()
            .contentType("application/json")
            .body(Map.of("input", original))
            .post("/base64/encode");
        
        verifySuccess(encodeResponse);
        String encoded = encodeResponse.jsonPath().getString("output");
        
        // Decode
        Response decodeResponse = given()
            .contentType("application/json")
            .body(Map.of("input", encoded))
            .post("/base64/decode");
        
        verifySuccess(decodeResponse);
        String decoded = decodeResponse.jsonPath().getString("output");
        
        assertThat(decoded).isEqualTo(original);
    }
    
    @Test
    @DisplayName("URL Encode")
    public void testUrlEncode() {
        String input = "Hello World & More!";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of("input", input))
            .post("/utilities/url/encode");
        
        verifySuccess(response);
        String encoded = response.jsonPath().getString("output");
        assertThat(encoded).isNotNull();
        // URLEncoder uses + for spaces, both + and %20 are valid
        assertThat(encoded).matches(".*(%20|\\+).*");
    }
    
    @Test
    @DisplayName("URL Encode/Decode Roundtrip")
    public void testUrlRoundtrip() {
        String original = "Hello World & More!";
        
        Response encodeResponse = given()
            .contentType("application/json")
            .body(Map.of("input", original))
            .post("/utilities/url/encode");
        
        verifySuccess(encodeResponse);
        String encoded = encodeResponse.jsonPath().getString("output");
        
        Response decodeResponse = given()
            .contentType("application/json")
            .body(Map.of("input", encoded))
            .post("/utilities/url/decode");
        
        verifySuccess(decodeResponse);
        String decoded = decodeResponse.jsonPath().getString("output");
        
        assertThat(decoded).isEqualTo(original);
    }
    
    @Test
    @DisplayName("SHA-256 Hash Generation")
    public void testSha256Hash() {
        String input = "Hello, World!";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", input,
                "algorithm", "SHA-256"
            ))
            .post("/utilities/hash/generate");
        
        verifySuccess(response);
        String hash = response.jsonPath().getString("output");
        assertThat(hash).isNotNull();
        assertThat(hash).matches("^[a-f0-9]{64}$"); // SHA-256 format
    }
    
    @Test
    @DisplayName("MD5 Hash Generation")
    public void testMd5Hash() {
        String input = "Hello, World!";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", input,
                "algorithm", "MD5"
            ))
            .post("/utilities/hash/generate");
        
        verifySuccess(response);
        String hash = response.jsonPath().getString("output");
        assertThat(hash).isNotNull();
        assertThat(hash).matches("^[a-f0-9]{32}$"); // MD5 format
    }
    
    @Test
    @DisplayName("UUID v4 Generation")
    public void testUuidV4Generation() {
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "version", "v4",
                "count", 1
            ))
            .post("/utilities/uuid/generate");
        
        verifySuccess(response);
        // UUID endpoint returns an array in the response
        java.util.List<String> uuidList = response.jsonPath().getList("output", String.class);
        assertThat(uuidList).isNotNull();
        assertThat(uuidList).hasSizeGreaterThan(0);
        
        String uuid = uuidList.get(0);
        assertThat(uuid).matches("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$");
    }
    
    @Test
    @DisplayName("UUID Bulk Generation")
    public void testUuidBulkGeneration() {
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "version", "v4",
                "count", 10
            ))
            .post("/utilities/uuid/generate");
        
        verifySuccess(response);
        // UUID endpoint returns an array of UUIDs
        java.util.List<String> uuidList = response.jsonPath().getList("output", String.class);
        assertThat(uuidList).isNotNull();
        assertThat(uuidList).hasSizeGreaterThanOrEqualTo(10);
    }
    
    @Test
    @DisplayName("JSON Schema Validation - Valid")
    public void testJsonValidationValid() {
        String validJson = loadTestFile("minimal.json");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", validJson,
                "format", "json"
            ))
            .post("/validate");
        
        verifySuccess(response);
    }
    
    @Test
    @DisplayName("JSON Schema Validation - Invalid")
    public void testJsonValidationInvalid() {
        String invalidJson = "{ invalid json }";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", invalidJson,
                "format", "json"
            ))
            .post("/validate");
        
        assertThat(response.getStatusCode()).isIn(200, 400);
        // Should either return success=false or 400 error
    }
    
    @Test
    @DisplayName("Gzip Compression")
    public void testGzipCompression() {
        String input = loadTestFile("complex.json");
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of("input", input))
            .post("/compress/gzip");
        
        verifySuccess(response);
        String compressed = response.jsonPath().getString("base64Encoded");
        assertThat(compressed).isNotNull();
        
        // Verify compression stats
        Integer originalSize = response.jsonPath().getInt("originalSize");
        Integer compressedSize = response.jsonPath().getInt("compressedSize");
        assertThat(originalSize).isGreaterThan(0);
        assertThat(compressedSize).isLessThan(originalSize);
    }
    
    @Test
    @DisplayName("Gzip Compression/Decompression Roundtrip")
    public void testGzipRoundtrip() {
        String original = loadTestFile("complex.json");
        
        // Compress
        Response compressResponse = given()
            .contentType("application/json")
            .body(Map.of("input", original))
            .post("/compress/gzip");
        
        verifySuccess(compressResponse);
        String compressed = compressResponse.jsonPath().getString("base64Encoded");
        
        // Decompress
        Response decompressResponse = given()
            .contentType("application/json")
            .body(Map.of("input", compressed))
            .post("/decompress/gzip");
        
        verifySuccess(decompressResponse);
        String decompressed = decompressResponse.jsonPath().getString("output");
        
        assertThat(decompressed).isEqualTo(original);
    }
}

