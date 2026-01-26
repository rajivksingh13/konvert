# 📘 KonvertR User Guide & Runbook
## Complete Guide for Windows and macOS Users

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Format Conversion](#format-conversion)
5. [Formatting & Beautification](#formatting--beautification)
6. [Base64 Operations](#base64-operations)
7. [File Upload & Conversion](#file-upload--conversion)
8. [Utility Tools](#utility-tools)
9. [Advanced Features](#advanced-features)
10. [Troubleshooting](#troubleshooting)
11. [API Reference](#api-reference)
12. [Examples & Use Cases](#examples--use-cases)

---

## Introduction

### What is KonvertR?

KonvertR is a **universal format converter** and data transformation tool that runs **100% offline** on your local machine. It's a professional desktop application that helps developers, DevOps engineers, and data analysts convert, format, and transform data between various formats.

### Key Features

- ✅ **15+ Format Conversions** - JSON, YAML, XML, TOML, CSV, Protobuf, Properties
- ✅ **Formatting & Beautification** - JSON, YAML, CSV formatters
- ✅ **Base64 Operations** - Encode/decode Base64 strings
- ✅ **File Upload** - Drag & drop file conversion
- ✅ **10+ Utility Tools** - Encoding, JWT, UUID, Hash, Validation, Diff, Minify, Transform
- ✅ **100% Offline** - No internet connection required
- ✅ **Modern UI** - Professional design with dark/light theme
- ✅ **Cross-Platform** - Works on Windows, macOS, and Linux

### System Requirements

**Windows:**
- Windows 10 or later
- Java 17+ (JDK) - Included in portable versions
- 200 MB free disk space

**macOS:**
- macOS 10.14 or later
- Java 17+ (JDK) - Included in portable versions
- 200 MB free disk space

---

## Installation

### Option 1: Portable Application (Recommended)

#### Windows

1. **Download the portable package:**
   - Download `KonvertR-Portable-1.0.0.zip` from releases
   - Extract the ZIP file to any location (e.g., `C:\Programs\KonvertR\`)

2. **Run the application:**
   - Navigate to the extracted folder
   - Double-click `KonvertR.exe`
   - The application will start and open in your default browser at `http://localhost:8080`

3. **First Launch:**
   - The first launch may take 10-15 seconds as the backend initializes
   - Your browser will open automatically
   - If it doesn't, manually open `http://localhost:8080`

#### macOS

1. **Download the portable package:**
   - Download `KonvertR-Portable-1.0.0.zip` from releases
   - Extract the ZIP file to any location (e.g., `~/Applications/KonvertR/`)

2. **Run the application:**
   - Navigate to the extracted folder
   - Double-click `KonvertR.app`
   - The application will start and open in your default browser at `http://localhost:8080`

3. **macOS Security (First Launch):**
   - macOS may show a security warning
   - Go to **System Preferences → Security & Privacy**
   - Click **"Open Anyway"** next to the KonvertR message
   - Or right-click the app → **Open** → Confirm

## Getting Started

### First Launch

1. **Start KonvertR:**
   - Windows: Double-click `KonvertR.exe`
   - macOS: Double-click `KonvertR.app`

2. **Wait for initialization:**
   - Backend starts (10-15 seconds)
   - Browser opens automatically to `http://localhost:8080`

3. **Verify it's working:**
   - You should see the KonvertR interface
   - Try a simple conversion (see examples below)

### Interface Overview

The KonvertR interface has several tabs:

- **Converter** - Format conversion between different data formats
- **Formatter** - Beautify and format JSON, YAML, CSV
- **Base64** - Encode/decode Base64 strings
- **Files** - Upload and convert files
- **Utilities** - Various utility tools (encoding, JWT, UUID, hash, etc.)

### Quick Test

**Test JSON to YAML conversion:**

1. Click on the **Converter** tab
2. Select **"JSON → YAML"** from the dropdown
3. Paste this JSON:
   ```json
   {
     "name": "John Doe",
     "age": 30,
     "city": "New York"
   }
   ```
4. Click **"Convert"**
5. You should see the YAML output:
   ```yaml
   name: John Doe
   age: 30
   city: New York
   ```

✅ **If this works, KonvertR is ready to use!**

---

## Format Conversion

KonvertR supports bidirectional conversion between multiple formats:

### Supported Conversions

| From | To | Bidirectional |
|------|-----|---------------|
| JSON | YAML | ✅ Yes |
| JSON | TOML | ✅ Yes |
| JSON | XML | ✅ Yes |
| JSON | Protobuf | ✅ Yes (requires schema) |
| YAML | CSV | ✅ Yes |
| CSV | JSON | ✅ Yes |
| CSV | XML | ✅ Yes |
| CSV | YAML | ✅ Yes |
| Properties | YAML | ⚠️ One-way only |

### JSON ↔ YAML

**Example: JSON to YAML**

**Input (JSON):**
```json
{
  "application": {
    "name": "KonvertR",
    "version": "1.0.0",
    "settings": {
      "theme": "dark",
      "language": "en"
    },
    "features": ["conversion", "formatting", "utilities"]
  }
}
```

**Output (YAML):**
```yaml
application:
  name: KonvertR
  version: 1.0.0
  settings:
    theme: dark
    language: en
  features:
    - conversion
    - formatting
    - utilities
```

**Steps:**
1. Go to **Converter** tab
2. Select **"JSON → YAML"**
3. Paste JSON in the input area
4. Click **"Convert"**
5. Copy the YAML output

**Example: YAML to JSON**

**Input (YAML):**
```yaml
server:
  host: localhost
  port: 8080
  ssl:
    enabled: true
    certificate: /path/to/cert.pem
```

**Output (JSON):**
```json
{
  "server": {
    "host": "localhost",
    "port": 8080,
    "ssl": {
      "enabled": true,
      "certificate": "/path/to/cert.pem"
    }
  }
}
```

### JSON ↔ TOML

**Example: JSON to TOML**

**Input (JSON):**
```json
{
  "title": "Example",
  "database": {
    "host": "localhost",
    "port": 5432
  },
  "tags": ["production", "database"]
}
```

**Output (TOML):**
```toml
title = "Example"

[database]
host = "localhost"
port = 5432

tags = ["production", "database"]
```

### JSON ↔ XML

**Example: JSON to XML**

**Input (JSON):**
```json
{
  "person": {
    "name": "Alice",
    "age": 25,
    "email": "alice@example.com"
  }
}
```

**Output (XML):**
```xml
<person>
  <name>Alice</name>
  <age>25</age>
  <email>alice@example.com</email>
</person>
```

### JSON ↔ Protobuf

**Important:** Protobuf conversion requires a schema file (`.proto`).

**Example: JSON to Protobuf**

**Step 1: Create Protobuf Schema**

Create a `.proto` file:
```protobuf
syntax = "proto3";

message Person {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

**Step 2: Convert**

1. Go to **Converter** tab
2. Select **"JSON → Protobuf"**
3. Paste JSON:
   ```json
   {
     "name": "Bob",
     "age": 30,
     "email": "bob@example.com"
   }
   ```
4. Paste the schema in the **"Protobuf Schema"** field
5. Click **"Convert"**

**Protobuf Schema Examples:**

See `test-samples/README_PROTOBUF.md` for detailed schema creation guide.

### CSV ↔ JSON/YAML/XML

**Example: CSV to JSON**

**Input (CSV):**
```csv
name,age,city
John,30,New York
Jane,25,Los Angeles
Bob,35,Chicago
```

**Output (JSON):**
```json
[
  {
    "name": "John",
    "age": "30",
    "city": "New York"
  },
  {
    "name": "Jane",
    "age": "25",
    "city": "Los Angeles"
  },
  {
    "name": "Bob",
    "age": "35",
    "city": "Chicago"
  }
]
```

**Example: CSV to YAML**

**Input (CSV):**
```csv
key,value
database.host,localhost
database.port,5432
app.name,KonvertR
```

**Output (YAML):**
```yaml
- key: database.host
  value: localhost
- key: database.port
  value: "5432"
- key: app.name
  value: KonvertR
```

### Properties → YAML

**Example: Properties to YAML**

**Input (Properties):**
```properties
app.name=KonvertR
app.version=1.0.0
database.host=localhost
database.port=5432
server.ssl.enabled=true
```

**Output (YAML):**
```yaml
app:
  name: KonvertR
  version: 1.0.0
database:
  host: localhost
  port: 5432
server:
  ssl:
    enabled: true
```

---

## Formatting & Beautification

KonvertR can format and beautify JSON, YAML, and CSV files.

### JSON Formatter

**Example: Format Unformatted JSON**

**Input (Unformatted):**
```json
{"name":"John","age":30,"address":{"street":"123 Main St","city":"New York"},"hobbies":["reading","coding"]}
```

**Output (Formatted):**
```json
{
  "name": "John",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York"
  },
  "hobbies": [
    "reading",
    "coding"
  ]
}
```

**Steps:**
1. Go to **Formatter** tab
2. Select **"JSON"**
3. Paste unformatted JSON
4. Click **"Format"**

### YAML Formatter

**Example: Format Compact YAML**

**Input (Compact):**
```yaml
app:name:KonvertR
app:version:1.0.0
database:host:localhost
database:port:5432
```

**Output (Formatted):**
```yaml
app:
  name: KonvertR
  version: 1.0.0
database:
  host: localhost
  port: 5432
```

### CSV Formatter

**Example: Format CSV with Column Alignment**

**Input (CSV):**
```csv
name,age,email,city
John,30,john@example.com,New York
Jane,25,jane@example.com,Los Angeles
Bob,35,bob@example.com,Chicago
```

**Output (Aligned CSV):**
```csv
name,age,email            ,city
John,30 ,john@example.com,New York
Jane,25 ,jane@example.com,Los Angeles
Bob ,35 ,bob@example.com ,Chicago
```

**Steps:**
1. Go to **Formatter** tab
2. Select **"CSV"**
3. Check **"Align Columns"** (optional)
4. Paste CSV data
5. Click **"Format"**

---

## Base64 Operations

### Encode to Base64

**Example: Encode Text**

**Input:**
```
Hello, World!
```

**Output:**
```
SGVsbG8sIFdvcmxkIQ==
```

**Steps:**
1. Go to **Base64** tab
2. Select **"Encode"**
3. Paste text in input area
4. Click **"Encode"**

### Decode from Base64

**Example: Decode Base64**

**Input:**
```
SGVsbG8sIFdvcmxkIQ==
```

**Output:**
```
Hello, World!
```

**Steps:**
1. Go to **Base64** tab
2. Select **"Decode"**
3. Paste Base64 string
4. Click **"Decode"**

### Use Cases

- **Encode binary data** for JSON/XML transmission
- **Decode API responses** that return Base64
- **Encode credentials** for basic authentication
- **Process file contents** as Base64 strings

---

## File Upload & Conversion

KonvertR supports drag-and-drop file uploads with automatic format detection.

### Upload Single File

**Steps:**

1. Go to **Files** tab
2. **Drag and drop** a file into the upload area, OR
   - Click **"Choose File"** button
   - Select a file from your computer
3. Select target format (e.g., **"JSON → YAML"**)
4. Click **"Convert"**
5. Download the converted file

### Supported File Formats

- `.json` - JSON files
- `.yaml`, `.yml` - YAML files
- `.xml` - XML files
- `.toml` - TOML files
- `.csv` - CSV files
- `.properties` - Properties files
- `.proto` - Protobuf schema files

### Batch File Conversion

**Steps:**

1. Go to **Files** tab
2. Click **"Choose Files"** (multiple selection)
3. Select multiple files (hold `Ctrl` on Windows, `Cmd` on macOS)
4. Select target format
5. Click **"Convert All"**
6. Download converted files individually or as ZIP

### Automatic Format Detection

KonvertR automatically detects file format from:
- **File extension** (`.json`, `.yaml`, etc.)
- **File content** (if extension is missing)

**Example:**

Upload `config.json` → Automatically detected as JSON
Upload `data.txt` (contains JSON) → Detected as JSON from content

### File Size Limits

- **Maximum file size:** 10 MB per file
- **Batch limit:** 20 files per batch
- **Total batch size:** 50 MB

---

## Utility Tools

KonvertR includes comprehensive utility tools accessible from the **Utilities** tab.

### Encoding & Decoding

#### URL Encoding/Decoding

**Example: URL Encode**

**Input:**
```
https://example.com/search?q=hello world&lang=en
```

**Output:**
```
https://example.com/search?q=hello%20world&lang=en
```

**Use Cases:**
- Encode URLs for API requests
- Encode query parameters
- Handle special characters in URLs

**Example: URL Decode**

**Input:**
```
https://example.com/search?q=hello%20world&lang=en
```

**Output:**
```
https://example.com/search?q=hello world&lang=en
```

#### HTML Entity Encoding/Decoding

**Example: HTML Encode**

**Input:**
```html
<div>Hello & Welcome</div>
```

**Output:**
```
&lt;div&gt;Hello &amp; Welcome&lt;/div&gt;
```

**Use Cases:**
- Display HTML code in text
- Escape HTML in templates
- Prevent XSS attacks

**Example: HTML Decode**

**Input:**
```
&lt;div&gt;Hello &amp; Welcome&lt;/div&gt;
```

**Output:**
```html
<div>Hello & Welcome</div>
```

#### Hex Encoding/Decoding

**Example: Hex Encode**

**Input:**
```
Hello
```

**Output:**
```
48656c6c6f
```

**Use Cases:**
- Binary data representation
- Debugging binary protocols
- Low-level data manipulation

**Example: Hex Decode**

**Input:**
```
48656c6c6f
```

**Output:**
```
Hello
```

### JWT Decoder

Decode and inspect JWT (JSON Web Token) tokens.

**Example: Decode JWT**

**Input (JWT Token):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Output:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": 1516239022
  },
  "signature": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

**Steps:**
1. Go to **Utilities** tab
2. Expand **"JWT Decoder"** section
3. Paste JWT token
4. Click **"Decode"**

**Note:** This decoder shows the token structure but does **not verify** the signature.

### UUID Generator

Generate UUIDs (Universally Unique Identifiers).

**Example: Generate UUID v4**

**Steps:**
1. Go to **Utilities** tab
2. Expand **"UUID Generator"** section
3. Select **"v4"** (random UUID)
4. Enter count: **5**
5. Click **"Generate"**

**Output:**
```
550e8400-e29b-41d4-a716-446655440000
6ba7b810-9dad-11d1-80b4-00c04fd430c8
6ba7b811-9dad-11d1-80b4-00c04fd430c8
6ba7b812-9dad-11d1-80b4-00c04fd430c8
6ba7b813-9dad-11d1-80b4-00c04fd430c8
```

**UUID Versions:**
- **v4** - Random UUID (most common)
- **v1** - Time-based UUID

**Use Cases:**
- Generate unique IDs for databases
- Create session tokens
- Generate API keys
- Unique identifiers for resources

### Hash Generator

Generate cryptographic hashes.

**Example: Generate SHA-256 Hash**

**Input:**
```
password123
```

**Output:**
```
ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
```

**Steps:**
1. Go to **Utilities** tab
2. Expand **"Hash Generator"** section
3. Paste input text
4. Select algorithm: **SHA-256**
5. Click **"Generate"**

**Available Algorithms:**
- **MD5** - 32-character hex string
- **SHA-1** - 40-character hex string
- **SHA-256** - 64-character hex string (recommended)
- **SHA-512** - 128-character hex string

**Use Cases:**
- Password hashing (use SHA-256 or SHA-512)
- Data integrity verification
- Checksum generation
- Digital signatures

### Schema Validation

Validate data structure for various formats.

**Example: Validate JSON**

**Input:**
```json
{
  "name": "John",
  "age": 30
}
```

**Output:**
```
✅ Valid JSON
```

**Steps:**
1. Go to **Utilities** tab
2. Expand **"Schema Validation"** section
3. Select format: **JSON**
4. Paste data
5. Click **"Validate"**

**Supported Formats:**
- JSON
- YAML
- XML
- CSV
- TOML
- Properties

**Example: Invalid JSON**

**Input:**
```json
{
  "name": "John",
  "age": 30
  // Missing closing brace
```

**Output:**
```
❌ Invalid JSON
Error: Expected ',' or '}' at line 3
```

### Diff & Compare

Compare two files and find differences.

**Example: Compare JSON Files**

**File 1:**
```json
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

**File 2:**
```json
{
  "name": "John",
  "age": 31,
  "city": "Boston"
}
```

**Output:**
```
Differences found:
- age: 30 → 31
- city: "New York" → "Boston"
```

**Steps:**
1. Go to **Utilities** tab
2. Expand **"Diff & Compare"** section
3. Paste File 1 content
4. Paste File 2 content
5. Select format: **JSON**
6. Click **"Compare"**

**Supported Formats:**
- JSON
- YAML
- XML

**Use Cases:**
- Compare configuration files
- Find changes between versions
- Debug data differences
- Code review

### Minify & Compress

Minify data to reduce file size.

**Example: Minify JSON**

**Input (Formatted):**
```json
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

**Output (Minified):**
```json
{"name":"John","age":30,"city":"New York"}
```

**Steps:**
1. Go to **Utilities** tab
2. Expand **"Minify & Compress"** section
3. Select format: **JSON**
4. Paste data
5. Click **"Minify"**

**Supported Formats:**
- JSON
- YAML
- XML
- CSS

**Additional Features:**
- **CSS Beautify** - Format CSS code
- **Gzip Compression** - Compress data using Gzip
- **Remove Comments** - Remove comments and whitespace

### Data Transformation

Transform and manipulate data structures.

#### Merge JSON Objects

**Example: Merge Multiple JSON Objects**

**Object 1:**
```json
{
  "name": "John",
  "age": 30
}
```

**Object 2:**
```json
{
  "city": "New York",
  "country": "USA"
}
```

**Output:**
```json
{
  "name": "John",
  "age": 30,
  "city": "New York",
  "country": "USA"
}
```

#### Flatten Data

**Example: Flatten Nested JSON**

**Input:**
```json
{
  "user": {
    "name": "John",
    "address": {
      "city": "New York"
    }
  }
}
```

**Output (Flattened):**
```json
{
  "user.name": "John",
  "user.address.city": "New York"
}
```

#### Unflatten Data

**Example: Unflatten JSON**

**Input:**
```json
{
  "user.name": "John",
  "user.address.city": "New York"
}
```

**Output:**
```json
{
  "user": {
    "name": "John",
    "address": {
      "city": "New York"
    }
  }
}
```

#### Rename Keys

**Example: Rename Object Keys**

**Input:**
```json
{
  "oldName": "John",
  "oldAge": 30
}
```

**Rename Map:**
```json
{
  "oldName": "name",
  "oldAge": "age"
}
```

**Output:**
```json
{
  "name": "John",
  "age": 30
}
```

#### Transform Values

**Example: Transform String Values**

**Input:**
```json
{
  "name": "john doe",
  "email": "JOHN@EXAMPLE.COM"
}
```

**Transformation:** `uppercase`

**Output:**
```json
{
  "name": "JOHN DOE",
  "email": "JOHN@EXAMPLE.COM"
}
```

**Available Transformations:**
- `uppercase` - Convert to uppercase
- `lowercase` - Convert to lowercase
- `trim` - Remove leading/trailing whitespace
- `reverse` - Reverse string

#### Filter/Remove Fields

**Example: Remove Specific Fields**

**Input:**
```json
{
  "name": "John",
  "age": 30,
  "password": "secret123",
  "email": "john@example.com"
}
```

**Fields to Remove:** `password, age`

**Output:**
```json
{
  "name": "John",
  "email": "john@example.com"
}
```

#### Convert Types

**Example: Convert String to Number**

**Input:**
```json
{
  "age": "30",
  "score": "95.5"
}
```

**Type Map:**
```json
{
  "age": "integer",
  "score": "number"
}
```

**Output:**
```json
{
  "age": 30,
  "score": 95.5
}
```

**Supported Types:**
- `string`
- `integer`
- `number` (float)
- `boolean`

---

## Advanced Features

### Protobuf Schema Creation

Creating Protobuf schemas is required for Protobuf conversions. See detailed guide in `test-samples/README_PROTOBUF.md`.

**Quick Reference:**

```protobuf
syntax = "proto3";

message Person {
  string name = 1;
  int32 age = 2;
  string email = 3;
  repeated string tags = 4;
}
```

**Type Mapping:**

| JSON Type | Protobuf Type |
|-----------|---------------|
| `"text"` | `string` |
| `42` | `int32` or `int64` |
| `3.14` | `float` or `double` |
| `true/false` | `bool` |
| `[...]` | `repeated` |
| `{...}` | `message` |

### Batch Processing

**Example: Convert Multiple Files**

1. Go to **Files** tab
2. Select multiple files (hold `Ctrl`/`Cmd`)
3. Choose target format
4. Click **"Convert All"**
5. Download individual files or ZIP archive

### Theme Customization

**Switch Theme:**

1. Click the **theme toggle** button (🌓 icon)
2. Choose **Light** or **Dark** theme
3. Theme preference is saved automatically

### Keyboard Shortcuts

- `Ctrl/Cmd + C` - Copy output
- `Ctrl/Cmd + V` - Paste input
- `Ctrl/Cmd + A` - Select all
- `Tab` - Navigate between fields
- `Enter` - Submit form (in some contexts)

---

## Troubleshooting

### Application Won't Start

**Problem:** Application doesn't launch

**Solutions:**

**Windows:**
1. Check if Java is installed:
   ```powershell
   java -version
   ```
2. Check if port 8080 is available:
   ```powershell
   netstat -ano | findstr :8080
   ```
3. Run as Administrator (right-click → Run as Administrator)
4. Check Windows Defender/Antivirus (may block the app)

**macOS:**
1. Check if Java is installed:
   ```bash
   java -version
   ```
2. Check if port 8080 is available:
   ```bash
   lsof -i :8080
   ```
3. Allow app in Security & Privacy:
   - System Preferences → Security & Privacy
   - Click "Open Anyway" if blocked

### Browser Doesn't Open Automatically

**Problem:** Application starts but browser doesn't open

**Solutions:**
1. Manually open browser
2. Navigate to `http://localhost:8080`
3. Check if backend is running (check task manager/activity monitor)

### Port Already in Use

**Problem:** Error: "Port 8080 is already in use"

**Solutions:**

**Windows:**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### Conversion Fails

**Problem:** Conversion returns error

**Solutions:**
1. **Check input format:**
   - Verify input is valid (use Schema Validation)
   - Check for syntax errors

2. **Protobuf conversion:**
   - Ensure schema is provided
   - Verify schema matches data structure
   - Check field names match (case-sensitive)

3. **File upload:**
   - Check file size (max 10 MB)
   - Verify file format is supported
   - Ensure file is not corrupted

### Slow Performance

**Problem:** Application is slow

**Solutions:**
1. **Large files:**
   - Split large files into smaller chunks
   - Use batch processing for multiple files

2. **System resources:**
   - Close other applications
   - Check available RAM
   - Restart the application

3. **Network (if applicable):**
   - Ensure you're running offline (no network delays)
   - Check localhost connectivity

### File Download Issues

**Problem:** Can't download converted files

**Solutions:**
1. Check browser download settings
2. Check browser popup blocker
3. Try right-click → Save As
4. Check disk space

### Theme Not Saving

**Problem:** Theme resets on restart

**Solutions:**
1. Clear browser cache
2. Check browser storage permissions
3. Try different browser

---

## API Reference

KonvertR provides a REST API for programmatic access.

### Base URL

```
http://localhost:8080/api
```

### Format Conversion

**Endpoint:** `POST /api/convert`

**Request:**
```json
{
  "input": "{\"name\":\"John\"}",
  "fromFormat": "json",
  "toFormat": "yaml",
  "protobufSchema": "..." // optional, required for protobuf
}
```

**Response:**
```json
{
  "output": "name: John",
  "success": true
}
```

### Formatting

**Endpoint:** `POST /api/format`

**Request:**
```json
{
  "input": "{\"name\":\"John\"}",
  "formatType": "JSON",
  "alignColumns": false // optional, for CSV
}
```

**Response:**
```json
{
  "output": "{\n  \"name\": \"John\"\n}",
  "success": true
}
```

### Base64 Operations

**Encode:** `POST /api/base64/encode`
**Decode:** `POST /api/base64/decode`

**Request:**
```json
{
  "input": "Hello, World!"
}
```

**Response:**
```json
{
  "output": "SGVsbG8sIFdvcmxkIQ==",
  "success": true
}
```

### File Upload

**Endpoint:** `POST /api/files/upload`

**Request:** `multipart/form-data`
- `file`: File to upload
- `fromFormat`: Source format (optional, auto-detected)
- `toFormat`: Target format (optional, defaults to json)
- `protobufSchema`: Protobuf schema (optional)

**Response:**
```json
{
  "output": "...",
  "filename": "converted.yaml",
  "success": true
}
```

### Utilities

#### URL Encoding
- `POST /api/utilities/url/encode`
- `POST /api/utilities/url/decode`

#### HTML Encoding
- `POST /api/utilities/html/encode`
- `POST /api/utilities/html/decode`

#### Hex Encoding
- `POST /api/utilities/hex/encode`
- `POST /api/utilities/hex/decode`

#### JWT Decode
**Endpoint:** `POST /api/utilities/jwt/decode`

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### UUID Generation
**Endpoint:** `POST /api/utilities/uuid/generate`

**Request:**
```json
{
  "version": "v4",
  "count": 5
}
```

#### Hash Generation
**Endpoint:** `POST /api/utilities/hash/generate`

**Request:**
```json
{
  "input": "password123",
  "algorithm": "SHA-256"
}
```

#### Schema Validation
**Endpoint:** `POST /api/validate`

**Request:**
```json
{
  "input": "{\"name\":\"John\"}",
  "format": "json"
}
```

#### Diff & Compare
**Endpoint:** `POST /api/diff/compare`

**Request:**
```json
{
  "file1": "{\"name\":\"John\"}",
  "file2": "{\"name\":\"Jane\"}",
  "format": "json"
}
```

#### Minify
**Endpoint:** `POST /api/minify`

**Request:**
```json
{
  "input": "{\"name\":\"John\"}",
  "format": "json"
}
```

#### Data Transformation

**Merge:** `POST /api/utilities/transform/merge`
**Flatten:** `POST /api/utilities/transform/flatten`
**Unflatten:** `POST /api/utilities/transform/unflatten`
**Rename Keys:** `POST /api/utilities/transform/rename-keys`
**Transform Values:** `POST /api/utilities/transform/transform-values`
**Filter Fields:** `POST /api/utilities/transform/filter-fields`
**Convert Types:** `POST /api/utilities/transform/convert-types`

See main README.md for complete API documentation.

---

## Examples & Use Cases

### Use Case 1: Configuration File Conversion

**Scenario:** Convert application configuration from JSON to YAML

**Steps:**
1. Open `config.json`
2. Copy content
3. Go to **Converter** tab
4. Select **"JSON → YAML"**
5. Paste and convert
6. Save as `config.yaml`

**Example:**

**Input (`config.json`):**
```json
{
  "server": {
    "host": "localhost",
    "port": 8080
  },
  "database": {
    "url": "jdbc:postgresql://localhost:5432/mydb",
    "username": "admin"
  }
}
```

**Output (`config.yaml`):**
```yaml
server:
  host: localhost
  port: 8080
database:
  url: jdbc:postgresql://localhost:5432/mydb
  username: admin
```

### Use Case 2: API Response Formatting

**Scenario:** Format unformatted JSON API response

**Steps:**
1. Copy API response
2. Go to **Formatter** tab
3. Select **"JSON"**
4. Paste and format
5. Copy formatted output

**Example:**

**Input (Unformatted):**
```json
{"status":"success","data":{"users":[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]}}
```

**Output (Formatted):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John"
      },
      {
        "id": 2,
        "name": "Jane"
      }
    ]
  }
}
```

### Use Case 3: CSV to JSON Conversion

**Scenario:** Convert CSV export to JSON for API integration

**Steps:**
1. Open CSV file
2. Copy content
3. Go to **Converter** tab
4. Select **"CSV → JSON"**
5. Paste and convert
6. Use JSON in API request

**Example:**

**Input (`users.csv`):**
```csv
id,name,email
1,John,john@example.com
2,Jane,jane@example.com
```

**Output (JSON):**
```json
[
  {
    "id": "1",
    "name": "John",
    "email": "john@example.com"
  },
  {
    "id": "2",
    "name": "Jane",
    "email": "jane@example.com"
  }
]
```

### Use Case 4: JWT Token Inspection

**Scenario:** Decode and inspect JWT token for debugging

**Steps:**
1. Copy JWT token from API response
2. Go to **Utilities** tab
3. Expand **"JWT Decoder"**
4. Paste token
5. Click **"Decode"**

**Example:**

**Input:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Output:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": 1516239022
  }
}
```

### Use Case 5: Data Transformation Pipeline

**Scenario:** Transform API response data structure

**Steps:**
1. Convert JSON → YAML
2. Flatten nested structure
3. Rename keys
4. Filter sensitive fields
5. Convert back to JSON

**Example:**

**Step 1: Original Data**
```json
{
  "user": {
    "personal": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "contact": {
      "email": "john@example.com",
      "phone": "123-456-7890"
    }
  }
}
```

**Step 2: Flatten**
```json
{
  "user.personal.firstName": "John",
  "user.personal.lastName": "Doe",
  "user.contact.email": "john@example.com",
  "user.contact.phone": "123-456-7890"
}
```

**Step 3: Rename Keys**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "123-456-7890"
}
```

**Step 4: Filter Fields (remove phone)**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

### Use Case 6: Batch File Processing

**Scenario:** Convert multiple configuration files

**Steps:**
1. Go to **Files** tab
2. Select multiple `.json` files
3. Choose **"JSON → YAML"**
4. Click **"Convert All"**
5. Download ZIP archive

**Example:**

**Files:**
- `app.json` → `app.yaml`
- `database.json` → `database.yaml`
- `server.json` → `server.yaml`

**Result:** All files converted and packaged in ZIP

### Use Case 7: Hash Generation for Passwords

**Scenario:** Generate SHA-256 hash for password storage

**Steps:**
1. Go to **Utilities** tab
2. Expand **"Hash Generator"**
3. Enter password
4. Select **SHA-256**
5. Click **"Generate"**

**Example:**

**Input:**
```
MySecurePassword123!
```

**Output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Use Case 8: Configuration Comparison

**Scenario:** Compare two configuration files to find differences

**Steps:**
1. Go to **Utilities** tab
2. Expand **"Diff & Compare"**
3. Paste File 1 content
4. Paste File 2 content
5. Select format: **JSON**
6. Click **"Compare"**

**Example:**

**File 1 (`config-v1.json`):**
```json
{
  "app": {
    "name": "MyApp",
    "version": "1.0.0"
  }
}
```

**File 2 (`config-v2.json`):**
```json
{
  "app": {
    "name": "MyApp",
    "version": "1.1.0"
  }
}
```

**Output:**
```
Differences:
- app.version: "1.0.0" → "1.1.0"
```

---

## Sample Code Examples

### cURL Examples

#### Convert JSON to YAML

```bash
curl -X POST http://localhost:8080/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "input": "{\"name\":\"John\",\"age\":30}",
    "fromFormat": "json",
    "toFormat": "yaml"
  }'
```

#### Format JSON

```bash
curl -X POST http://localhost:8080/api/format \
  -H "Content-Type: application/json" \
  -d '{
    "input": "{\"name\":\"John\",\"age\":30}",
    "formatType": "JSON"
  }'
```

#### Encode Base64

```bash
curl -X POST http://localhost:8080/api/base64/encode \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Hello, World!"
  }'
```

#### Generate UUID

```bash
curl -X POST http://localhost:8080/api/utilities/uuid/generate \
  -H "Content-Type: application/json" \
  -d '{
    "version": "v4",
    "count": 5
  }'
```

#### Generate Hash

```bash
curl -X POST http://localhost:8080/api/utilities/hash/generate \
  -H "Content-Type: application/json" \
  -d '{
    "input": "password123",
    "algorithm": "SHA-256"
  }'
```

### Python Examples

#### Convert JSON to YAML

```python
import requests

url = "http://localhost:8080/api/convert"
data = {
    "input": '{"name":"John","age":30}',
    "fromFormat": "json",
    "toFormat": "yaml"
}

response = requests.post(url, json=data)
print(response.json()["output"])
```

#### Format JSON

```python
import requests

url = "http://localhost:8080/api/format"
data = {
    "input": '{"name":"John","age":30}',
    "formatType": "JSON"
}

response = requests.post(url, json=data)
print(response.json()["output"])
```

#### Upload File

```python
import requests

url = "http://localhost:8080/api/files/upload"
files = {"file": open("config.json", "rb")}
data = {
    "fromFormat": "json",
    "toFormat": "yaml"
}

response = requests.post(url, files=files, data=data)
print(response.json()["output"])
```

### JavaScript/Node.js Examples

#### Convert JSON to YAML

```javascript
const fetch = require('node-fetch');

const url = 'http://localhost:8080/api/convert';
const data = {
  input: '{"name":"John","age":30}',
  fromFormat: 'json',
  toFormat: 'yaml'
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(data => console.log(data.output));
```

#### Format JSON

```javascript
const fetch = require('node-fetch');

const url = 'http://localhost:8080/api/format';
const data = {
  input: '{"name":"John","age":30}',
  formatType: 'JSON'
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(data => console.log(data.output));
```

### PowerShell Examples (Windows)

#### Convert JSON to YAML

```powershell
$body = @{
    input = '{"name":"John","age":30}'
    fromFormat = "json"
    toFormat = "yaml"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/convert" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

Write-Output $response.output
```

#### Format JSON

```powershell
$body = @{
    input = '{"name":"John","age":30}'
    formatType = "JSON"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/format" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

Write-Output $response.output
```

---

## Best Practices

### 1. Validate Before Converting

Always validate your input data before conversion:

1. Use **Schema Validation** tool
2. Fix any errors
3. Then proceed with conversion

### 2. Backup Original Files

Before batch conversion:
1. Create backup of original files
2. Test conversion on one file first
3. Verify output format
4. Then convert remaining files

### 3. Use Appropriate Formats

- **JSON** - APIs, web applications
- **YAML** - Configuration files, CI/CD
- **TOML** - Configuration files (Rust, Python)
- **XML** - Legacy systems, SOAP APIs
- **CSV** - Data analysis, spreadsheets

### 4. Handle Large Files

For files > 5 MB:
1. Split into smaller chunks
2. Process individually
3. Merge results if needed

### 5. Protobuf Schemas

- Keep schemas version-controlled
- Document schema changes
- Test conversions with sample data

### 6. Security Considerations

- **Never** paste sensitive data in shared screens
- Use **Filter Fields** to remove sensitive data
- Clear browser cache after use
- Run offline for maximum security

---

## Frequently Asked Questions (FAQ)

### Q: Does KonvertR require internet connection?

**A:** No! KonvertR runs **100% offline**. All processing happens locally on your machine.

### Q: Can I use KonvertR via command line?

**A:** Yes! KonvertR provides a REST API. You can use `curl`, Python, PowerShell, or any HTTP client to interact with it programmatically.

### Q: What file sizes are supported?

**A:** 
- Single file: Up to 10 MB
- Batch: Up to 20 files, 50 MB total

### Q: Can I convert binary files?

**A:** KonvertR focuses on text-based formats. For binary data, use Base64 encoding first.

### Q: Is my data sent to external servers?

**A:** No! All processing happens locally. No data leaves your machine.

### Q: Can I customize the conversion behavior?

**A:** Some conversions support options (e.g., CSV column alignment). Check the specific tool documentation.

### Q: How do I report bugs or request features?

**A:** Please report issues on the project's GitHub repository.

### Q: Can I use KonvertR in production?

**A:** Yes! KonvertR is suitable for production use. However, ensure you have proper backup and testing procedures.

### Q: Does KonvertR support custom formats?

**A:** Currently, KonvertR supports standard formats. Custom format support may be added in future versions.

### Q: Can I integrate KonvertR into my application?

**A:** Yes! Use the REST API to integrate KonvertR into your applications. See the API Reference section.

---

## Additional Resources

### Documentation Files

- `README.md` - Main project documentation
- `QUICKSTART.md` - Quick start guide
- `ARCHITECTURE.md` - Architecture details
- `FEATURE_ROADMAP.md` - Feature roadmap
- `test-samples/README.md` - Test samples guide
- `test-samples/README_PROTOBUF.md` - Protobuf guide
- `test-samples/README-UTILITIES.md` - Utilities guide

### Sample Files

Located in `test-samples/` directory:
- `sample.json`, `sample.yaml`, `sample.xml`, `sample.toml`
- `complex.json`, `complex.yaml`
- `person.proto` - Protobuf schema example
- Various utility test files

### Support

For issues, questions, or contributions:
- Check existing documentation
- Review sample files
- Test with provided examples
- Report issues on GitHub

---

## Conclusion

KonvertR is a powerful, offline-first tool for format conversion and data transformation. This guide covers all features with practical examples for Windows and macOS users.

**Key Takeaways:**

✅ **100% Offline** - No internet required  
✅ **15+ Format Conversions** - JSON, YAML, XML, TOML, CSV, Protobuf  
✅ **Comprehensive Utilities** - Encoding, JWT, UUID, Hash, Validation, Diff, Transform  
✅ **File Upload Support** - Drag & drop, batch processing  
✅ **REST API** - Programmatic access  
✅ **Cross-Platform** - Windows, macOS, Linux  

**Happy Converting! 🚀**

---

*Last Updated: 2024*  
*Version: 1.0.0*
