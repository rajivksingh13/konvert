# Protobuf Schema Creation Guide

## What is a Protobuf Schema?

A Protobuf schema is a `.proto` file that defines the structure of your data. It's like a blueprint that tells Protobuf how to encode and decode your messages.

## Basic Syntax

### Simple Message
```protobuf
syntax = "proto3";

message Person {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

### Key Components

1. **Syntax Version**: `syntax = "proto3";` (or `proto2`)
2. **Message**: Defines a data structure
3. **Fields**: Each field has:
   - **Type**: `string`, `int32`, `bool`, etc.
   - **Name**: Field name
   - **Number**: Unique field number (1, 2, 3...)

## Field Types

### Scalar Types
```protobuf
message Example {
  string name = 1;           // Text
  int32 age = 2;            // 32-bit integer
  int64 timestamp = 3;      // 64-bit integer
  float price = 4;          // Floating point
  double precision = 5;     // Double precision
  bool isActive = 6;        // Boolean
  bytes data = 7;           // Binary data
}
```

### Complex Types
```protobuf
message Address {
  string street = 1;
  string city = 2;
  string state = 3;
  string zipCode = 4;
}

message Person {
  string name = 1;
  Address address = 2;      // Nested message
}
```

### Arrays (Repeated Fields)
```protobuf
message Person {
  string name = 1;
  repeated string tags = 2;           // Array of strings
  repeated PhoneNumber phones = 3;    // Array of messages
}

message PhoneNumber {
  string type = 1;
  string number = 2;
}
```

### Maps
```protobuf
message Config {
  map<string, string> settings = 1;      // Map<string, string>
  map<int32, string> codes = 2;         // Map<int32, string>
}
```

## Complete Example

Here's a complete example matching our sample data:

```protobuf
syntax = "proto3";

package com.konvert;

option java_package = "com.konvert.proto";
option java_outer_classname = "PersonProto";

message Person {
  string name = 1;
  int32 age = 2;
  string email = 3;
  Address address = 4;
  repeated PhoneNumber phone_numbers = 5;
  bool is_active = 6;
  repeated string tags = 7;
  Metadata metadata = 8;
}

message Address {
  string street = 1;
  string city = 2;
  string state = 3;
  string zip_code = 4;
}

message PhoneNumber {
  string type = 1;
  string number = 2;
}

message Metadata {
  string created_at = 1;
  string last_modified = 2;
  int32 version = 3;
}
```

## Field Number Rules

- **Must be unique** within a message
- **1-15**: Use for frequently used fields (1 byte encoding)
- **16-2047**: Use for less frequent fields (2 bytes encoding)
- **19000-19999**: Reserved, don't use
- **Cannot be changed** once in production (breaks compatibility)

## Naming Conventions

- **Message names**: PascalCase (`Person`, `PhoneNumber`)
- **Field names**: snake_case (`phone_number`, `zip_code`)
- **Enum names**: PascalCase
- **Service names**: PascalCase

## Common Patterns

### Optional Fields (Proto3)
```protobuf
message Person {
  string name = 1;
  optional string email = 2;  // Can be omitted
}
```

### Enums
```protobuf
enum Status {
  STATUS_UNKNOWN = 0;
  STATUS_ACTIVE = 1;
  STATUS_INACTIVE = 2;
}

message User {
  string name = 1;
  Status status = 2;
}
```

### Oneof (Mutually Exclusive Fields)
```protobuf
message Response {
  oneof result {
    string error = 1;
    Data data = 2;
  }
}
```

## Creating Schema from JSON

### Step 1: Analyze Your JSON
```json
{
  "name": "John",
  "age": 30,
  "email": "john@example.com"
}
```

### Step 2: Create Corresponding Proto
```protobuf
syntax = "proto3";

message Person {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

### Step 3: Handle Nested Objects
**JSON:**
```json
{
  "address": {
    "street": "123 Main St",
    "city": "New York"
  }
}
```

**Proto:**
```protobuf
message Person {
  Address address = 1;
}

message Address {
  string street = 1;
  string city = 2;
}
```

### Step 4: Handle Arrays
**JSON:**
```json
{
  "tags": ["java", "python", "go"]
}
```

**Proto:**
```protobuf
message Person {
  repeated string tags = 1;
}
```

## Using in Konvert Application

### For JSON → Protobuf:
1. **Create your `.proto` file** (or use existing one)
2. **Copy the entire `.proto` content**
3. **In Konvert:**
   - Select "JSON → Protobuf"
   - Paste your JSON in the input area
   - Paste your `.proto` schema in the schema text area
   - Click "Convert"

### For Protobuf → JSON:
1. **Have your base64-encoded Protobuf data**
2. **Copy your `.proto` schema**
3. **In Konvert:**
   - Select "Protobuf → JSON"
   - Paste base64 Protobuf in the input area
   - Paste your `.proto` schema in the schema text area
   - Click "Convert"

## Example Workflow

### 1. Start with JSON
```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com"
}
```

### 2. Create Schema
```protobuf
syntax = "proto3";

message Person {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

### 3. Use in Konvert
- Input: JSON data
- Schema: `.proto` content
- Output: Base64-encoded Protobuf (or vice versa)

## Tips

1. **Start Simple**: Begin with basic fields, add complexity later
2. **Use Meaningful Names**: Clear field names make schemas readable
3. **Plan Field Numbers**: Reserve 1-15 for frequently used fields
4. **Document**: Add comments to explain complex structures
5. **Version Control**: Keep `.proto` files in version control

## Comments in Proto Files

```protobuf
// Single-line comment

/*
 * Multi-line comment
 */

message Person {
  string name = 1;        // Person's full name
  int32 age = 2;         // Age in years
  // email is optional
  string email = 3;
}
```

## Common Mistakes

1. **Missing syntax declaration**: Always include `syntax = "proto3";`
2. **Duplicate field numbers**: Each field number must be unique
3. **Starting field numbers at 0**: Start at 1
4. **Changing field numbers**: Breaks backward compatibility
5. **Wrong type mapping**: Use correct types (string vs bytes, int32 vs int64)

## Field Type Mapping

| JSON Type | Protobuf Type | Notes |
|-----------|---------------|-------|
| string | string | Text data |
| number (integer) | int32 or int64 | Choose based on range |
| number (float) | float or double | Choose based on precision |
| boolean | bool | true/false |
| null | (omit field) | Proto3 doesn't have null |
| array | repeated | Use repeated keyword |
| object | message | Define nested message |

## Quick Reference

```protobuf
syntax = "proto3";

// Package (optional but recommended)
package com.example;

// Options for Java
option java_package = "com.example.proto";
option java_outer_classname = "ExampleProto";

// Main message
message YourMessage {
  // Scalar fields
  string field1 = 1;
  int32 field2 = 2;
  bool field3 = 3;
  
  // Nested message
  NestedMessage nested = 4;
  
  // Array
  repeated string items = 5;
  
  // Map
  map<string, string> config = 6;
}

// Nested message
message NestedMessage {
  string value = 1;
}
```

## Next Steps

1. **Create your schema**: Write a `.proto` file matching your data structure
2. **Test it**: Use the sample files in `test-samples/` directory
3. **Use in Konvert**: Copy schema content into the schema text area
4. **Convert**: Test JSON ↔ Protobuf conversions

For examples, see `test-samples/person.proto` which matches the sample JSON data.

