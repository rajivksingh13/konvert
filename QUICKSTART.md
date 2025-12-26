# Quick Start Guide - Konvert (Java Edition)

## Prerequisites

- **Java 17 or higher** (JDK, not just JRE)
- **Maven 3.6+**
- **Internet connection** (for downloading dependencies)

## Quick Start

### 1. Build the Project
```bash
mvn clean package
```

### 2. Run the Application

#### Option A: Using exec plugin (Recommended - Most Reliable)
```bash
# Windows
run-simple.bat

# Linux/macOS
chmod +x run-simple.sh
./run-simple.sh

# Or directly
mvn exec:java -Dexec.mainClass="com.konvert.KonvertApplication"
```

#### Option B: Using Maven JavaFX Plugin
```bash
# Windows
run.bat

# Linux/macOS
chmod +x run.sh
./run.sh

# Or directly
mvn javafx:run
```

**Note:** If JavaFX plugin gives errors, use Option A instead.

#### Option C: Run JAR directly (after building)
```bash
# First build
mvn clean package

# Then run with classpath
java -cp "target/konvert-1.0.0.jar;target/dependency/*" com.konvert.KonvertApplication
```

### 3. Create Native Executable

#### Windows:
```bash
build.bat
```

#### Linux/macOS:
```bash
chmod +x build.sh
./build.sh
```

This creates a native installer (.exe on Windows, .dmg on macOS, AppImage on Linux) that includes the JRE.

## Project Structure

```
konvert/
├── pom.xml                              # Maven configuration
├── src/main/java/com/konvert/
│   ├── KonvertApplication.java         # Main entry point
│   ├── MainWindow.java                 # Main window
│   ├── ConverterPanel.java             # Converter UI
│   ├── FormatterPanel.java             # Formatter UI
│   ├── FormatConverter.java            # Conversion logic
│   └── FormatFormatter.java            # Formatting logic
├── build.bat / build.sh                # Build scripts
├── run.bat / run.sh                    # Run scripts
└── README.md                           # Full documentation
```

## Usage Examples

### Converting JSON to YAML
1. Select "JSON → YAML" from dropdown
2. Paste JSON in input area
3. Click "Convert"
4. Copy output from output area

### Formatting JSON
1. Go to "Formatter" tab
2. Select "JSON"
3. Paste unformatted JSON
4. Click "Format"
5. Copy formatted output

## Troubleshooting

### "javafx:run" fails
Make sure you have Java 17+ and Maven installed:
```bash
java -version
mvn -version
```

### "jpackage not found"
jpackage is included with JDK 14+. Check your Java version:
```bash
java -version
```

### Build fails with dependency errors
Make sure you have internet connection. Maven needs to download dependencies on first build.

### Application won't start
Check that all dependencies are downloaded:
```bash
mvn dependency:resolve
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check conversion examples in README
- Explore the code in `src/main/java/com/konvert/`

