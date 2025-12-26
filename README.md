# 🔄 Konvert - Universal Format Converter

A modern web-based desktop application with Java Spring Boot backend and beautiful HTML/CSS/JavaScript frontend for converting between various data formats.

## Architecture

- **Backend**: Java Spring Boot REST API (conversion logic)
- **Frontend**: Modern HTML/CSS/JavaScript (professional UI/UX)
- **Best of Both**: Strong Java libraries + Modern web UI

## Features

### Converters
- ✅ JSON ↔ YAML
- ✅ Properties → YAML
- ✅ JSON ↔ TOML
- ✅ XML ↔ JSON
- ✅ JSON ↔ Protobuf (requires schema)
- ✅ Protobuf → JSON (requires schema)
- ✅ CSV ↔ JSON
- ✅ CSV ↔ YAML
- ✅ CSV ↔ XML

### Formatters
- ✅ JSON Formatter
- ✅ YAML Formatter

## Prerequisites

- **Java 17 or higher**
- **Maven 3.6+**

## Quick Start

### 1. Build the Application
```bash
mvn clean package
```

### 2. Run the Application (Completely Offline!)
```bash
# Windows - Auto-opens browser
launch.bat

# Linux/macOS - Auto-opens browser
chmod +x launch.sh
./launch.sh

# Or directly
mvn spring-boot:run
```

### 3. Access the Application
- **Browser opens automatically** to `http://localhost:8080`
- Or manually open: `http://localhost:8080`
- **✅ No internet required!** Everything runs locally.

## Offline Operation

✅ **100% Local** - No internet connection needed  
✅ **Localhost Server** - Spring Boot runs on `localhost:8080`  
✅ **No External Dependencies** - All resources bundled  
✅ **System Fonts** - No CDN fonts required  
✅ **Local Processing** - All conversion happens on your machine

The application runs a **local web server** and opens in your browser, but everything is processed locally - no internet required!

## Project Structure

```
konvert/
├── pom.xml                              # Maven configuration
├── src/main/
│   ├── java/com/konvert/
│   │   ├── KonvertApplication.java     # Spring Boot main class
│   │   ├── controller/
│   │   │   ├── ConverterController.java # REST API for conversion
│   │   │   └── FormatterController.java # REST API for formatting
│   │   ├── FormatConverter.java        # Conversion logic (Java)
│   │   └── FormatFormatter.java        # Formatting logic (Java)
│   └── resources/
│       ├── application.properties       # Spring Boot config
│       └── static/                     # Web frontend
│           ├── index.html              # Main UI
│           ├── styles.css             # Modern styling
│           └── app.js                  # Frontend logic
└── README.md
```

## Technologies

### Backend (Java)
- **Spring Boot 3.2.0** - REST API framework
- **Jackson** - JSON/YAML/XML processing
- **SnakeYAML** - YAML parsing
- **protobuf-java** - Protobuf support
- **toml4j** - TOML parsing

### Frontend (Web)
- **HTML5** - Structure
- **CSS3** - Modern styling with gradients, shadows, animations
- **JavaScript (ES6+)** - Interactive UI
- **Fetch API** - REST API communication

## API Endpoints

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
  "formatType": "JSON" // or "YAML"
}
```

## Development

### Run in Development Mode
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Build Executable JAR
```bash
mvn clean package
java -jar target/konvert-1.0.0.jar
```

## UI Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on different screen sizes
- **Fast**: Instant conversions via REST API
- **User-Friendly**: Intuitive controls and clear feedback
- **Keyboard Shortcuts**: Ctrl+Enter to convert/format

## Advantages of This Architecture

1. **Separation of Concerns**: Backend logic separate from UI
2. **Modern UI**: Web technologies provide better UI/UX
3. **Easy to Extend**: Add new features to frontend or backend independently
4. **Cross-Platform**: Works on any OS with a browser
5. **Maintainable**: Clear separation makes code easier to maintain

## Future Enhancements

- Add file upload/download
- Add syntax highlighting
- Add dark mode
- Add conversion history
- Package as Electron app for true desktop experience

## License

MIT
