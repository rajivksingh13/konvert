# UI Wording Review

This document lists the current UI text and one-liners (descriptions) for each
section and feature so wording can be reviewed end-to-end.

## Global Navigation

| Text | Liner |
| --- | --- |
| Brand | KonvertR |
| Tagline | Enterprise Data Hygiene & Validation Engine |

### Top Nav Tabs

| Text | Liner |
| --- | --- |
| Transform | Tab label |
| Beautify | Tab label |
| Encode / Decode | Tab label |
| File Tools | Tab label |
| ToolKit | Tab label |

## Transform (Converter)

### Sidebar Sections

| Text | Liner |
| --- | --- |
| Format Conversion | Convert between JSON, YAML, TOML, TOON, XML, CSV, Protobuf, and Properties formats |
| Data Transformation (Structural) | Merge, flatten, rename keys, filter fields, and transform data structures |

### Format Conversion Panel

| Text | Liner |
| --- | --- |
| Convert Between Formats | Transform your data between JSON, YAML, TOML, TOON, XML, CSV, Protobuf, and Properties formats |

### Data Transformation Sections

| Text | Liner |
| --- | --- |
| Merge Multiple JSON Objects | Combine multiple JSON objects into a single object |
| Flatten Nested Structures | Convert nested JSON/YAML structures to flat key-value pairs |
| Unflatten Data | Convert flat key-value pairs back to nested structures |
| Rename Keys | Rename object keys using a mapping configuration |
| Transform Values | Transform string values: uppercase, lowercase, trim, or reverse |
| Filter / Remove Fields | Remove specific fields from JSON or YAML objects |
| Convert Types | Convert data types using type mapping (string -> integer, etc.) - Supports JSON and YAML |
| TOON Statistics & Token Analysis | Analyze token efficiency and size reduction when converting to TOON format |

## Beautify (Formatter)

### Sidebar Sections

| Text | Liner |
| --- | --- |
| Formatters | Pretty-print JSON, YAML, and CSV for better readability |
| Cleanup & Minification | Minify data, remove comments, and beautify CSS |

### Formatter Sections

| Text | Liner |
| --- | --- |
| JSON Formatter | Pretty-print JSON for better readability |
| YAML Formatter | Pretty-print YAML for better readability |
| CSV Formatter | Format CSV with optional column alignment |
| TOON Formatter | Format TOON with custom delimiters (comma, tab, pipe) |

### Cleanup Sections

| Text | Liner |
| --- | --- |
| Minify | Minify JSON, YAML, XML, or CSS to reduce file size |
| Remove Comments & Extra Whitespace | Remove comments and extra whitespace from JSON, YAML, XML, or CSS |
| CSS Beautify | Beautify CSS for better readability |

## Encode / Decode (Base64)

### Sidebar Sections

| Text | Liner |
| --- | --- |
| Encoding / Decoding | Base64, URL, HTML entity, and Hex encoding/decoding |
| Token Utilities | JWT decoder with header, payload, and signature inspection |

### Encoding Sections

| Text | Liner |
| --- | --- |
| Base64 Encoding/Decoding | Encode text to Base64 or decode Base64 to text |
| URL Encoding/Decoding | Encode or decode URL-encoded strings |
| HTML Entity Encoding/Decoding | Encode or decode HTML entities |
| Hex Encoding/Decoding | Encode text to hexadecimal or decode hex to text |
| JWT Decoder | Decode JWT tokens with header, payload, and signature inspection |

## File Tools

### Sidebar Sections

| Text | Liner |
| --- | --- |
| File Operations | Drag & drop upload, file-based format conversion, auto-detect format |
| Batch Processing | Convert multiple files at once, mixed format support, bulk download |
| Compare & Diff | Side-by-side file comparison, visual diff highlighting |

### File Tool Sections

| Text | Liner |
| --- | --- |
| File Operations | Drag & drop upload, file-based format conversion, auto-detect format, download converted files |
| Batch Processing | Convert multiple files at once, mixed format support, bulk download |
| Compare & Diff | Side-by-side file comparison, visual diff highlighting |

## ToolKit (Utilities)

### Sidebar Sections

| Text | Liner |
| --- | --- |
| Validation & Hashing | Validate data formats and generate hash values |
| ID Generation & Compression | Generate UUIDs and compress/decompress data |

### Utility Sections

| Text | Liner |
| --- | --- |
| Validation | Validate JSON, YAML, XML, CSV, TOML, TOON, and Properties formats |
| Hashing | Generate MD5, SHA-1, SHA-256, and SHA-512 hashes |
| ID Generation | Generate UUID v4 (random), UUID v1 (time-based), and bulk UUIDs (1-100) |
| Compression | Gzip compression and decompression |

## Buttons, Placeholders, Helper Tips

### Transform (Converter)

#### Format Conversion Panel
- Buttons: Convert, Converting..., Clear All, Copy, Clear
- Placeholders: Enter input data here...; Converted output will appear here...; Paste your .proto schema definition here...
- Helper tips: All bidirectional; Auto-detect format; Preserve data types

#### Merge Multiple JSON Objects
- Buttons: Merge, Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter multiple JSON objects, one per line...; Merged JSON will appear here...
- Helper tips: Place each JSON object on a separate line or separate them with whitespace; Multi-line JSON objects are supported; The merge preserves the structure of nested objects; Click in the input area to start editing

#### Flatten Nested Structures
- Buttons: Flatten, Clear, Copy Output, Show Examples / Hide Examples, Show separator examples
- Placeholders: Separator (default: .); Enter nested ${format.toUpperCase()}...; Flattened ${format.toUpperCase()} will appear here...
- Helper tips: Use "." for readable paths, "_" for variable names, "/" for URL-like paths; Remember the separator you use - you'll need it for unflattening!; Works with both JSON and YAML formats

#### Unflatten Data
- Buttons: Unflatten, Clear, Copy Output, Show Examples / Hide Examples, Show separator examples
- Placeholders: Separator (default: .); Enter flattened ${format.toUpperCase()}...; Unflattened ${format.toUpperCase()} will appear here...
- Helper tips: None

#### Rename Keys
- Buttons: Rename, Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter JSON to rename keys...; {"oldKey": "newKey", "anotherOld": "anotherNew"}; Renamed JSON will appear here...
- Helper tips: Rename map format: {"oldKey": "newKey"}; Use multiple mappings: {"key1": "new1", "key2": "new2"}; Keys not in the map keep their original names; Works recursively on all nested levels; Sample data shown - Click in the input area to start editing

#### Transform Values
- Buttons: Transform, Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter JSON...; Transformed JSON will appear here...
- Helper tips: Uppercase converts all strings to uppercase (e.g., "hello" -> "HELLO"); Lowercase converts all strings to lowercase (e.g., "HELLO" -> "hello"); Trim removes leading and trailing whitespace (e.g., "  hello  " -> "hello"); Reverse reverses the character order (e.g., "hello" -> "olleh"); Non-string values (numbers, booleans, null, objects, arrays) are preserved as-is

#### Filter / Remove Fields
- Buttons: Filter, Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter ${format.toUpperCase()}...; Fields to remove (comma-separated): field1, field2; Filtered ${format.toUpperCase()} will appear here...
- Helper tips: Use comma-separated list: password, email, id; Or use JSON array format: ["password", "email", "id"]; Great for removing sensitive data before sharing JSON/YAML; Works with both JSON and YAML formats; Fields are removed recursively from all nesting levels

#### Convert Types
- Buttons: Convert, Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter ${format.toUpperCase()}...; Converted ${format.toUpperCase()} will appear here...
- Helper tips: None

#### TOON Statistics & Token Analysis
- Buttons: Analyze, Analyzing..., Clear
- Placeholders: Enter your data in the selected format to analyze TOON efficiency...
- Helper tips: None

### Beautify (Formatter)

#### JSON Formatter
- Buttons: Format, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter JSON data here...; Formatted JSON will appear here...
- Helper tips: Useful for debugging and reading JSON files; Improves code readability and maintainability; Works with valid JSON only - invalid JSON will show an error; All data types are preserved (strings, numbers, booleans, null, objects, arrays)

#### YAML Formatter
- Buttons: Format, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter YAML data here...; Formatted YAML will appear here...
- Helper tips: Useful for configuration files and data serialization; Improves readability and maintainability; Works with valid YAML only - invalid YAML will show an error; Maintains proper indentation and structure

#### CSV Formatter
- Buttons: Format, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter CSV data here...; Formatted CSV will appear here...
- Helper tips: Useful for organizing and viewing CSV data; Column alignment option improves readability for numeric data; Works with standard CSV format (comma-separated); Preserves all data including headers and values

#### TOON Formatter
- Buttons: Format, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter TOON data to format...; Formatted TOON will appear here...
- Helper tips: Comma (,) is most common and best for general use; Tab is useful for copy-paste from spreadsheets; Pipe (|) avoids conflicts with data content; Select the delimiter that matches your TOON data format; Nested keys use dot notation (e.g., address.street)

#### Minify
- Buttons: Minify, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter ${format.toUpperCase()} data to minify...; Minified ${format.toUpperCase()} will appear here...
- Helper tips: Useful for production builds to reduce file sizes; Significantly reduces file size (often 50-70% reduction); Improves loading times and bandwidth usage; Select the correct format (JSON, YAML, XML, CSS, TOON) for accurate minification

#### Remove Comments & Extra Whitespace
- Buttons: Remove, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter ${format.toUpperCase()} data with comments...; Cleaned ${format.toUpperCase()} will appear here...
- Helper tips: JSON removes // and /* */ comments; YAML removes # comments (inline and block); CSS removes /* */ comments (block and inline); XML removes <!-- --> comments; Useful for preparing files for production deployment; Select the correct format for accurate comment removal

#### CSS Beautify
- Buttons: Beautify, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: Enter CSS here...; Beautified CSS will appear here...
- Helper tips: Useful for formatting minified or compact CSS files; Improves readability and makes CSS easier to debug; Organizes CSS rules with proper indentation; Helps maintain consistent coding style; Preserves all CSS functionality including selectors, properties, and values

### Encode / Decode (Base64)

#### Base64 Encoding/Decoding
- Buttons: Process, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: None
- Helper tips: Useful for embedding binary data in text-based formats (JSON, XML, URLs); Increases data size by approximately 33%; Base64 strings may end with = or == for padding; Commonly used in data URIs, email attachments, and API authentication

#### URL Encoding/Decoding
- Buttons: Process, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: None
- Helper tips: Essential for URLs with query parameters containing special characters; Prevents issues with spaces, ampersands, and other reserved characters; Useful for API calls and web forms; Also called percent encoding or URL percent encoding

#### HTML Entity Encoding/Decoding
- Buttons: Process, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: None
- Helper tips: Essential for preventing XSS (Cross-Site Scripting) attacks; Use when displaying user input in HTML to prevent script injection; Numeric entities (&#60;) and named entities (&lt;) are both supported; Commonly used in web forms, comments, and content management systems

#### Hex Encoding/Decoding
- Buttons: Process, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: None
- Helper tips: Hexadecimal uses base-16 numbering (0-9, A-F); Each byte is represented by exactly two hex digits; Useful for binary data representation and debugging; Common in memory dumps, network protocols, and file formats; Hex strings are case-insensitive (uppercase/lowercase both work)

#### JWT Decoder
- Buttons: Decode, Decoding..., Clear, Copy
- Placeholders: Enter JWT token to decode...; JWT header will appear here...; JWT payload will appear here...; JWT signature will appear here...
- Helper tips: None

### File Tools

#### File Operations
- Buttons: Convert, Converting..., Clear, Copy, Download, Show How To Use / Hide How To Use
- Placeholders: Paste your .proto schema definition here...
- Helper tips: Use "Auto-detect" for source format when you're unsure of the file format; For Protobuf conversions, make sure to provide a valid .proto schema; Large files may take longer to convert - be patient; The converted file will have the appropriate extension based on the target format; You can convert between any supported formats

#### Batch Processing
- Buttons: Convert Batch, Processing..., Clear, Download All, Download, Show How To Use / Hide How To Use
- Placeholders: None
- Helper tips: Use "Auto-detect" for source format when working with mixed file types; You can upload files gradually - files are added to the list, not replaced; Remove unwanted files before processing to save time; For Protobuf conversions, ensure all files use the same schema; Large batches may take longer - be patient during processing; Review the results list before downloading to ensure all conversions succeeded; Failed files are clearly marked - you can fix and retry them individually; Use "Download All" for convenience, or download files individually for better control

#### Compare & Diff
- Buttons: Compare, Comparing..., Clear
- Placeholders: None
- Helper tips: None

### ToolKit (Utilities)

#### Validation
- Buttons: Validate, Validating..., Clear, Copy Output, Show How To Use / Hide How To Use, Show Examples / Hide Examples
- Placeholders: Enter ${format.toUpperCase()} data to validate...; Validation result will appear here...
- Helper tips: Make sure to select the correct format before validating; For large files, validation may take a moment; Error messages will indicate the specific issue and location when possible; Use this tool to verify data before processing or storing; Select the correct format (JSON, YAML, XML, CSV, TOML, TOON, Properties) for accurate validation; Valid data returns a success message with format type; Invalid data returns detailed error messages explaining what's wrong; Useful for testing API responses, configuration files, and data imports; Common use cases: API testing, data quality checks, configuration validation

#### Hashing
- Buttons: Generate, Generating..., Clear, Copy Output, Show How To Use / Hide How To Use, Show Examples / Hide Examples
- Placeholders: Enter text to hash...; ${algorithm} hash will appear here...
- Helper tips: SHA-256 is recommended for most security applications; MD5 and SHA-1 should not be used for security-sensitive applications; The same input will always produce the same hash; Even a small change in input produces a completely different hash; Hashes are one-way functions - you cannot reverse a hash to get the original data

#### ID Generation
- Buttons: Generate, Generating..., Clear, Copy Output
- Placeholders: Count; Generated UUIDs will appear here...
- Helper tips: None

#### Compression
- Buttons: Compress, Decompress, Processing..., Clear, Copy Output, Show Examples / Hide Examples
- Placeholders: None
- Helper tips: Text data compresses better than already-compressed binary data; Repetitive patterns (like JSON structures) compress very well; Always decompress with the same format you compressed (GZIP -> GZIP); Base64 encoding increases size by ~33%, but enables text transmission; Check compression ratio to evaluate if compression is beneficial
