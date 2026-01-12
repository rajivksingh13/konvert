package com.konvertr.tests.transformation;

import com.konvertr.tests.BaseTest;
import io.restassured.response.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for data transformation endpoints
 */
@DisplayName("Data Transformation Tests")
public class DataTransformationTest extends BaseTest {
    
    @Test
    @DisplayName("Merge JSON Objects")
    public void testMergeJsonObjects() {
        String obj1 = "{\"name\":\"John\",\"age\":30}";
        String obj2 = "{\"city\":\"New York\",\"country\":\"USA\"}";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of("inputs", List.of(obj1, obj2)))
            .post("/utilities/transform/merge");
        
        verifySuccess(response);
        String merged = response.jsonPath().getString("output");
        assertThat(merged).isNotNull();
        
        Map<String, Object> parsed = parseJson(merged);
        assertThat(parsed).containsKey("name");
        assertThat(parsed).containsKey("age");
        assertThat(parsed).containsKey("city");
        assertThat(parsed).containsKey("country");
    }
    
    @Test
    @DisplayName("Flatten Nested Structure")
    public void testFlatten() {
        String nestedJson = "{\"user\":{\"name\":\"John\",\"email\":\"john@example.com\"}}";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", nestedJson,
                "inputFormat", "json",
                "outputFormat", "json",
                "separator", "."
            ))
            .post("/utilities/transform/flatten");
        
        verifySuccess(response);
        String flattened = response.jsonPath().getString("output");
        assertThat(flattened).isNotNull();
        
        Map<String, Object> parsed = parseJson(flattened);
        assertThat(parsed).containsKey("user.name");
        assertThat(parsed).containsKey("user.email");
    }
    
    @Test
    @DisplayName("Unflatten Structure")
    public void testUnflatten() {
        String flattenedJson = "{\"user.name\":\"John\",\"user.email\":\"john@example.com\"}";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", flattenedJson,
                "inputFormat", "json",
                "outputFormat", "json",
                "separator", "."
            ))
            .post("/utilities/transform/unflatten");
        
        verifySuccess(response);
        String unflattened = response.jsonPath().getString("output");
        assertThat(unflattened).isNotNull();
        
        Map<String, Object> parsed = parseJson(unflattened);
        assertThat(parsed).containsKey("user");
        Map<String, Object> user = (Map<String, Object>) parsed.get("user");
        assertThat(user).containsKey("name");
        assertThat(user).containsKey("email");
    }
    
    @Test
    @DisplayName("Rename Keys")
    public void testRenameKeys() {
        String inputJson = "{\"oldKey\":\"value\",\"anotherKey\":\"anotherValue\"}";
        String renameMap = "{\"oldKey\":\"newKey\",\"anotherKey\":\"renamedKey\"}";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", inputJson,
                "renameMap", renameMap
            ))
            .post("/utilities/transform/rename-keys");
        
        verifySuccess(response);
        String renamed = response.jsonPath().getString("output");
        assertThat(renamed).isNotNull();
        
        Map<String, Object> parsed = parseJson(renamed);
        assertThat(parsed).containsKey("newKey");
        assertThat(parsed).containsKey("renamedKey");
        assertThat(parsed).doesNotContainKey("oldKey");
    }
    
    @Test
    @DisplayName("Filter/Remove Fields")
    public void testFilterFields() {
        String inputJson = "{\"name\":\"John\",\"age\":30,\"email\":\"john@example.com\",\"password\":\"secret\"}";
        String fieldsToRemove = "password,age";
        
        Response response = given()
            .contentType("application/json")
            .body(Map.of(
                "input", inputJson,
                "inputFormat", "json",
                "outputFormat", "json",
                "fieldsToRemove", fieldsToRemove
            ))
            .post("/utilities/transform/filter-fields");
        
        verifySuccess(response);
        String filtered = response.jsonPath().getString("output");
        assertThat(filtered).isNotNull();
        
        Map<String, Object> parsed = parseJson(filtered);
        assertThat(parsed).doesNotContainKey("password");
        assertThat(parsed).doesNotContainKey("age");
        assertThat(parsed).containsKey("name");
        assertThat(parsed).containsKey("email");
    }
}

