# Test Samples for Konvert

This directory contains sample files for testing the Konvert format converter tool.

## File Structure

### Simple Examples
- `sample.json` - Basic JSON example with nested objects and arrays
- `sample.yaml` - Same data in YAML format
- `sample.xml` - Same data in XML format
- `sample.toml` - Same data in TOML format
- `sample.properties` - Properties file with nested keys
- `sample-protobuf.json` - JSON data ready for Protobuf conversion

### Complex Examples
- `complex.json` - Complex nested structure with multiple levels
- `complex.yaml` - Same complex data in YAML
- `complex.toml` - Same complex data in TOML

### Minimal Examples
- `minimal.json` - Minimal JSON with basic types
- `minimal.yaml` - Minimal YAML
- `minimal.toml` - Minimal TOML
- `minimal.properties` - Minimal properties

### Unformatted Examples (for Formatter)
- `unformatted.json` - Single-line JSON (use Formatter to format)
- `unformatted.yaml` - Compact YAML (use Formatter to format)

### Protobuf
- `person.proto` - Protobuf schema definition

## Testing Guide

### 1. Basic Conversions

**JSON to YAML:**
1. Open `sample.json`
2. Copy content
3. Select "JSON → YAML"
4. Paste and convert

**YAML to JSON:**
1. Open `sample.yaml`
2. Copy content
3. Select "YAML → JSON"
4. Paste and convert

**Properties to YAML:**
1. Open `sample.properties`
2. Copy content
3. Select "Properties → YAML"
4. Paste and convert

**JSON to TOML:**
1. Open `sample.json`
2. Copy content
3. Select "JSON → TOML"
4. Paste and convert

**TOML to JSON:**
1. Open `sample.toml`
2. Copy content
3. Select "TOML → JSON"
4. Paste and convert

**XML to JSON:**
1. Open `sample.xml`
2. Copy content
3. Select "XML → JSON"
4. Paste and convert

### 2. Formatting Tests

**Format JSON:**
1. Open `unformatted.json`
2. Copy content
3. Go to "Formatter" tab
4. Select "JSON"
5. Paste and format

**Format YAML:**
1. Open `unformatted.yaml`
2. Copy content
3. Go to "Formatter" tab
4. Select "YAML"
5. Paste and format

### 3. Complex Data Tests

Test with `complex.json`, `complex.yaml`, and `complex.toml` to verify:
- Nested objects
- Arrays of objects
- Multiple data types
- Large structures

### 4. Protobuf Conversion

**Note:** Protobuf conversion requires compiled schema files. To test:

1. Compile the `.proto` file:
   ```bash
   protoc --java_out=src/main/java person.proto
   ```

2. Use `sample-protobuf.json` as input
3. Paste `person.proto` content in the schema field
4. Convert JSON to Protobuf or Protobuf to JSON

## Expected Results

All sample files contain equivalent data, so conversions should produce similar structures:

- **sample.json** ↔ **sample.yaml** ↔ **sample.toml** ↔ **sample.xml**
- **complex.json** ↔ **complex.yaml** ↔ **complex.toml**
- **minimal.json** ↔ **minimal.yaml** ↔ **minimal.toml** ↔ **minimal.properties**

## Tips

1. **Round-trip testing**: Convert JSON → YAML → JSON to verify data integrity
2. **Format preservation**: Use formatter to ensure consistent formatting
3. **Edge cases**: Test with `minimal.*` files for basic type handling
4. **Complex structures**: Use `complex.*` files to test nested data handling

## File Descriptions

### sample.json / sample.yaml / sample.toml / sample.xml
Contains a person object with:
- Basic fields (name, age, email)
- Nested address object
- Array of phone numbers
- Boolean flag
- Array of tags
- Metadata object

### complex.json / complex.yaml / complex.toml
Contains an application configuration with:
- Nested settings
- Feature flags
- User array
- Statistics object
- Multiple nesting levels

### sample.properties
Contains application configuration with:
- Flat properties
- Nested keys (using dot notation)
- Comments
- Various data types

### person.proto
Protobuf schema matching the sample data structure. Use this for Protobuf conversions.

