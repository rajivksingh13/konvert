# Quick Start: Creating Protobuf Schemas

## Why You Need a Schema

Protobuf is a **binary format** that requires a schema (`.proto` file) to encode/decode data. Unlike JSON or YAML, you can't convert Protobuf without knowing its structure.

## Quick Example

### Your JSON Data:
```json
{
  "name": "John",
  "age": 30,
  "email": "john@example.com"
}
```

### Create This Schema:
```protobuf
syntax = "proto3";

message Person {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

### Use in Konvert:
1. Copy the JSON above → Input area
2. Copy the schema above → Schema text area
3. Select "JSON → Protobuf"
4. Click Convert!

## Step-by-Step Guide

### Step 1: Look at Your JSON Structure
Identify:
- Field names
- Field types (string, number, boolean, array, object)
- Nested objects
- Arrays

### Step 2: Map to Protobuf Types

| JSON | Protobuf |
|------|----------|
| `"text"` | `string` |
| `42` | `int32` or `int64` |
| `3.14` | `float` or `double` |
| `true/false` | `bool` |
| `[...]` | `repeated` |
| `{...}` | `message` |

### Step 3: Write the Schema

**Template:**
```protobuf
syntax = "proto3";

message YourMessageName {
  string field_name = 1;
  int32 another_field = 2;
}
```

**Rules:**
- Start with `syntax = "proto3";`
- Use `message` for objects
- Use `repeated` for arrays
- Field numbers start at 1, must be unique
- Use snake_case for field names

## Real Examples

### Example 1: Simple Object
**JSON:**
```json
{"name": "Test", "value": 100}
```

**Schema:**
```protobuf
syntax = "proto3";
message Data {
  string name = 1;
  int32 value = 2;
}
```

### Example 2: With Nested Object
**JSON:**
```json
{
  "person": {
    "name": "John",
    "age": 30
  }
}
```

**Schema:**
```protobuf
syntax = "proto3";
message Root {
  Person person = 1;
}
message Person {
  string name = 1;
  int32 age = 2;
}
```

### Example 3: With Array
**JSON:**
```json
{"tags": ["java", "python"]}
```

**Schema:**
```protobuf
syntax = "proto3";
message Data {
  repeated string tags = 1;
}
```

## Using Existing Schemas

We've provided example schemas:

1. **`person.proto`** - Matches `sample.json`
2. **`simple-example.proto`** - Basic example
3. **`config-example.proto`** - Matches `sample.properties`

**To use:**
1. Open the `.proto` file
2. Copy all content
3. Paste into Konvert's schema text area

## Common Patterns

### Pattern 1: Flat Object
```protobuf
message Config {
  string key = 1;
  string value = 2;
}
```

### Pattern 2: Nested Object
```protobuf
message Person {
  string name = 1;
  Address address = 2;
}
message Address {
  string street = 1;
  string city = 2;
}
```

### Pattern 3: Array of Primitives
```protobuf
message Data {
  repeated string items = 1;
}
```

### Pattern 4: Array of Objects
```protobuf
message Person {
  repeated Phone phones = 1;
}
message Phone {
  string type = 1;
  string number = 2;
}
```

## Tips

1. **Start Simple**: Begin with basic fields
2. **Field Numbers**: Use 1, 2, 3... (don't skip numbers)
3. **Naming**: Use snake_case for fields (`phone_number` not `phoneNumber`)
4. **Required Fields**: In proto3, all fields are optional by default
5. **Test**: Use simple data first, then complex

## Troubleshooting

**Problem**: "No message type found"
- **Solution**: Make sure your schema has at least one `message` definition

**Problem**: "Field not found"
- **Solution**: Check field names match between JSON and schema (case-sensitive)

**Problem**: "Invalid field number"
- **Solution**: Field numbers must start at 1 and be unique

## Quick Reference Card

```protobuf
syntax = "proto3";           // Always include this

message MyMessage {          // Define a message
  string text = 1;          // String field
  int32 number = 2;         // Integer field
  bool flag = 3;            // Boolean field
  Nested nested = 4;        // Nested message
  repeated string list = 5;  // Array of strings
}

message Nested {             // Nested message
  string value = 1;
}
```

## Next Steps

1. **Try the examples**: Use `person.proto` with `sample.json`
2. **Create your own**: Start with simple data
3. **Test in Konvert**: Copy schema → Paste in schema area → Convert!

For detailed syntax, see `PROTOBUF_GUIDE.md`

