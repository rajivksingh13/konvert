# 🔄 KonvertR - Universal Format Converter

A modern, professional web-based application for converting, formatting, and transforming data between various formats. Built with Java Spring Boot backend and React frontend with modern UI/UX.

## ✨ Features

### 🔄 Format Conversion
Convert between 7+ data formats with support for:
- **JSON** ↔ **YAML** (bidirectional)
- **JSON** ↔ **TOML** (bidirectional)
- **JSON** ↔ **XML** (bidirectional)
- **JSON** ↔ **Protobuf** (bidirectional, requires schema)
- **YAML** ↔ **CSV** (bidirectional)
- **CSV** ↔ **JSON** (bidirectional)
- **CSV** ↔ **XML** (bidirectional)
- **CSV** ↔ **YAML** (bidirectional)
- **Properties** → **YAML** (one-way)

**Special Features:**
- ✅ Protobuf schema support for binary protocol conversions
- ✅ Auto-format detection from file extensions
- ✅ Content-based format detection
- ✅ Preserves data structure and types

### ✨ Formatting & Beautification
- **JSON Formatter** - Pretty-print and format JSON with proper indentation
- **YAML Formatter** - Format YAML with consistent spacing
- **CSV Formatter** - Format CSV with optional column alignment for better readability

### 🔐 Base64 Operations
- **Encode to Base64** - Convert text to Base64 encoding
- **Decode from Base64** - Decode Base64 strings back to text

### 📁 File Upload & Conversion
- **Drag & Drop Support** - Easy file upload interface
- **Auto-Format Detection** - Automatically detects file format from extension or content
- **Batch Processing** - Convert multiple files at once
- **Download Results** - Download converted files directly
- **Format Support** - All conversion formats available for file uploads
- **Protobuf Schema** - Support for Protobuf schema files (.proto)

### 🛠️ Comprehensive Utilities

#### 🔤 Encoding & Decoding
- **URL Encoding/Decoding** - Encode/decode URL strings
- **HTML Entity Encoding/Decoding** - Encode/decode HTML entities
- **Hex Encoding/Decoding** - Convert text to/from hexadecimal

#### 🎫 JWT Operations
- **JWT Decoder** - Decode and inspect JWT tokens (header, payload, signature)

#### 🆔 UUID Generator
- **UUID v4** - Generate random UUIDs
- **UUID v1** - Generate time-based UUIDs
- **Bulk Generation** - Generate multiple UUIDs (1-100 at once)

#### 🔐 Hash Generator
- **MD5** - Generate MD5 hashes
- **SHA-1** - Generate SHA-1 hashes
- **SHA-256** - Generate SHA-256 hashes (default)
- **SHA-512** - Generate SHA-512 hashes

#### ✅ Schema Validation
Validate data structure for:
- **JSON** - Validate JSON syntax and structure
- **YAML** - Validate YAML syntax and structure
- **CSV** - Validate CSV format
- **XML** - Validate XML syntax and structure
- **TOML** - Validate TOML syntax
- **Properties** - Validate Properties file format

#### 🔍 Diff & Compare
- **File Comparison** - Compare two files side-by-side
- **Format Support** - Compare JSON, YAML, XML files
- **Difference Report** - Generate detailed difference reports
- **Visual Diff** - Highlight differences between files

#### 📦 Minify & Compress
- **Data Minification** - Minify JSON, YAML, XML, CSS
- **CSS Beautify** - Format and beautify CSS code
- **Gzip Compression** - Compress data using Gzip
- **Remove Comments & Whitespace** - Clean data by removing comments and extra whitespace (JSON, YAML, XML, CSS)

#### 🔄 Data Transformation
- **Merge JSON Objects** - Merge multiple JSON objects into one
- **Flatten Data** - Flatten nested structures (JSON, YAML) with custom separators
- **Unflatten Data** - Convert flattened data back to nested structures
- **Rename Keys** - Rename object keys using a mapping
- **Transform Values** - Transform string values (uppercase, lowercase, trim, reverse)
- **Filter/Remove Fields** - Remove specific fields from JSON or YAML objects
- **Convert Types** - Convert data types using type mapping (supports JSON and YAML)

## 🎨 Modern UI/UX Features

- **🎨 Professional Design** - Modern, clean interface with gradient accents
- **🌓 Dark/Light Theme** - Toggle between light and dark modes
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- **⚡ Smooth Animations** - Powered by Framer Motion for fluid interactions
- **🎯 Intuitive Navigation** - Easy-to-use tab-based interface
- **📋 Copy to Clipboard** - One-click copy with visual feedback
- **🔄 Real-time Processing** - Instant conversions with loading indicators
- **✨ Glass Effect** - Modern glassmorphism design elements
- **🎨 Gradient Buttons** - Beautiful gradient-styled action buttons
- **💫 Hover Effects** - Interactive hover states throughout

## 🏗️ Architecture

### Backend (Java Spring Boot)
- **Spring Boot 3.2.0** - REST API framework
- **Jackson** - JSON/YAML/XML processing
- **SnakeYAML** - YAML parsing and formatting
- **protobuf-java** - Protobuf support
- **toml4j** - TOML parsing
- **Apache Commons CSV** - CSV processing
- **Java 17+** - Modern Java features

### Frontend (React)
- **React 18.2.0** - Modern React with hooks
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Framer Motion 10.16.4** - Smooth animations and transitions
- **Lucide React** - Modern icon library
- **Responsive Design** - Mobile-first approach

## 📋 Prerequisites

- **Java 17 or higher** (JDK, not just JRE)
- **Maven 3.6+** (for backend)
- **Node.js 14+ and npm** (for frontend development)

## 🚀 Quick Start

### Option 1: Standalone Mode (Production)

1. **Build the Application**
   ```bash
   mvn clean package
   ```

2. **Run the Application**
   ```bash
   # Windows - Auto-opens browser
   launch.bat
   
   # Linux/macOS - Auto-opens browser
   chmod +x launch.sh
   ./launch.sh
   
   # Or directly
   mvn spring-boot:run
   ```

3. **Access the Application**
   - Browser opens automatically to `http://localhost:8080`
   - Or manually open: `http://localhost:8080`
   - ✅ **No internet required!** Everything runs locally.

## 🍏 macOS Install Note (Unsigned App)

If macOS says the app is damaged:
1. Move `KonvertR.app` to `/Applications`
2. Run `KonvertR-Setup.command` once (removes quarantine)
3. Launch `KonvertR.app`

### Option 2: Development Mode (React + Spring Boot)

1. **Start Spring Boot Backend**
   ```bash
   mvn spring-boot:run
   ```
   Backend runs on `http://localhost:8080`

2. **Start React Frontend** (in another terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000` with hot-reload

3. **Access the Application**
   - Open `http://localhost:3000` in your browser
   - React dev server proxies API calls to Spring Boot

### Option 3: Build & Deploy React to Spring Boot

1. **Build and Deploy React App**
   ```bash
   cd frontend
   npm install
   npm run build:deploy
   ```
   This builds React and copies it to `src/main/resources/static/`

2. **Start Spring Boot**
   ```bash
   mvn spring-boot:run
   ```

3. **Access the Application**
   - Open `http://localhost:8080` in your browser

## 🔒 Offline Operation

✅ **100% Local** - No internet connection needed  
✅ **Localhost Server** - Spring Boot runs on `localhost:8080`  
✅ **No External Dependencies** - All resources bundled  
✅ **System Fonts** - No CDN fonts required  
✅ **Local Processing** - All conversion happens on your machine

The application runs a **local web server** and opens in your browser, but everything is processed locally - no internet required!

## 📁 Project Structure

```
konvert/
├── frontend/                          # React frontend
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── components/                # React components
│   │   │   ├── UI/                    # Reusable UI components
│   │   │   ├── Converter.js           # Format converter
│   │   │   ├── Formatter.js           # Formatter
│   │   │   ├── Base64.js              # Base64 encoder/decoder
│   │   │   ├── Files.js               # File upload
│   │   │   ├── Utilities.js           # Utility tools
│   │   │   └── Navigation.js          # Navigation bar
│   │   ├── contexts/                  # React contexts (Theme)
│   │   ├── services/                  # API service layer
│   │   ├── App.js                     # Main app component
│   │   └── index.js                   # Entry point
│   ├── package.json
│   └── deploy.js                      # Deployment script
├── src/main/
│   ├── java/com/konvert/
│   │   ├── KonvertApplication.java    # Spring Boot main class
│   │   ├── controller/                 # REST controllers
│   │   │   ├── ConverterController.java
│   │   │   ├── FormatterController.java
│   │   │   ├── Base64Controller.java
│   │   │   ├── FileUploadController.java
│   │   │   └── UtilitiesController.java
│   │   ├── util/                       # Utility classes
│   │   │   ├── EncodingUtil.java
│   │   │   ├── HashUtil.java
│   │   │   ├── JWTUtil.java
│   │   │   ├── UUIDUtil.java
│   │   │   ├── SchemaValidationUtil.java
│   │   │   ├── DiffUtil.java
│   │   │   ├── MinifyUtil.java
│   │   │   ├── DataTransformUtil.java
│   │   │   ├── CsvUtil.java
│   │   │   └── FileFormatDetector.java
│   │   ├── FormatConverter.java        # Conversion logic
│   │   ├── FormatFormatter.java        # Formatting logic
│   │   └── Base64Util.java             # Base64 operations
│   └── resources/
│       ├── application.properties      # Spring Boot config
│       └── static/                     # Web frontend (after build)
│           ├── index.html
│           ├── styles.css
│           └── app.js
├── pom.xml                             # Maven configuration
└── README.md
```

## 🔌 API Endpoints

### Convert
```
POST /api/convert
Content-Type: application/json

{
  "input": "...",
  "fromFormat": "json",
  "toFormat": "yaml",
  "protobufSchema": "..." // optional, required for protobuf
}
```

### Format
```
POST /api/format
Content-Type: application/json

{
  "input": "...",
  "formatType": "JSON", // or "YAML" or "CSV"
  "alignColumns": false // optional, for CSV
}
```

### Base64
```
POST /api/base64/encode
POST /api/base64/decode
Content-Type: application/json

{
  "input": "..."
}
```

### File Upload
```
POST /api/files/upload
Content-Type: multipart/form-data

file: <file>
fromFormat: "json" (optional, auto-detected)
toFormat: "yaml" (optional, defaults to json)
protobufSchema: "..." (optional, required for protobuf)
```

### Utilities

#### Encoding/Decoding
```
POST /api/utilities/url/encode
POST /api/utilities/url/decode
POST /api/utilities/html/encode
POST /api/utilities/html/decode
POST /api/utilities/hex/encode
POST /api/utilities/hex/decode
```

#### JWT
```
POST /api/utilities/jwt/decode
{
  "token": "..."
}
```

#### UUID
```
POST /api/utilities/uuid/generate
{
  "version": "v4", // or "v1"
  "count": 1
}
```

#### Hash
```
POST /api/utilities/hash/generate
{
  "input": "...",
  "algorithm": "SHA-256" // MD5, SHA-1, SHA-256, SHA-512
}
```

#### Validation
```
POST /api/validate
{
  "input": "...",
  "format": "json" // json, yaml, csv, xml, toml, properties
}
```

#### Diff
```
POST /api/diff/compare
{
  "file1": "...",
  "file2": "...",
  "format": "json" // json, yaml, xml
}

POST /api/diff/report
{
  "file1": "...",
  "file2": "...",
  "format": "json"
}
```

#### Minify & Compress
```
POST /api/minify
{
  "input": "...",
  "format": "json" // json, yaml, xml, css
}

POST /api/beautify/css
{
  "input": "..."
}

POST /api/compress/gzip
{
  "input": "..."
}

POST /api/remove-comments
{
  "input": "...",
  "format": "json" // json, yaml, xml, css
}
```

#### Data Transformation
```
POST /api/utilities/transform/merge
{
  "objects": ["{...}", "{...}"]
}

POST /api/utilities/transform/flatten
{
  "input": "...",
  "format": "json",
  "separator": "."
}

POST /api/utilities/transform/unflatten
{
  "input": "...",
  "format": "json",
  "separator": "."
}

POST /api/utilities/transform/rename-keys
{
  "input": "...",
  "renameMap": "{\"oldKey\": \"newKey\"}"
}

POST /api/utilities/transform/transform-values
{
  "input": "...",
  "transformation": "uppercase" // uppercase, lowercase, trim, reverse
}

POST /api/utilities/transform/filter-fields
{
  "input": "...",
  "fieldsToRemove": "field1, field2"
}

POST /api/utilities/transform/convert-types
{
  "input": "...",
  "typeMap": "{\"field\": \"integer\"}"
}
```

## 🛠️ Development

### Build Executable JAR
```bash
mvn clean package
java -jar target/konvertr-1.0.0.jar
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Build Frontend for Production
```bash
cd frontend
npm run build
npm run build:deploy  # Builds and deploys to Spring Boot static folder
```

## 🎯 Key Features Summary

- ✅ **15+ Format Conversions** - Support for JSON, YAML, XML, TOML, CSV, Protobuf, Properties
- ✅ **3 Formatters** - JSON, YAML, CSV formatting with beautification
- ✅ **Base64 Operations** - Encode/decode Base64 strings
- ✅ **File Upload** - Drag & drop file conversion with auto-detection
- ✅ **10+ Utility Tools** - Encoding, JWT, UUID, Hash, Validation, Diff, Minify, Transform
- ✅ **Modern React UI** - Professional design with Tailwind CSS and Framer Motion
- ✅ **Dark/Light Theme** - Theme switching with persistent storage
- ✅ **Fully Responsive** - Works on all screen sizes
- ✅ **100% Offline** - No internet connection required
- ✅ **Fast & Efficient** - Real-time processing with instant feedback

## 📝 License

MIT
