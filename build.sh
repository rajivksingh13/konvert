#!/bin/bash

# Build script for Konvert
# Creates executable using jpackage

echo "Building Konvert..."

# Clean previous builds
mvn clean

# Build JAR
echo "Building JAR..."
mvn package

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Maven build failed!"
    exit 1
fi

# Create jpackage executable
echo "Creating native executable with jpackage..."

# Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    jpackage --input target \
        --name Konvert \
        --main-jar konvert-1.0.0.jar \
        --main-class com.konvert.KonvertApplication \
        --type exe \
        --win-dir-chooser \
        --win-menu \
        --win-shortcut \
        --win-menu-group "Konvert" \
        --app-version 1.0.0 \
        --description "Universal Format Converter" \
        --vendor "Konvert"
    
    echo "Windows executable created in current directory"
    
# macOS
elif [[ "$OSTYPE" == "darwin"* ]]; then
    jpackage --input target \
        --name Konvert \
        --main-jar konvert-1.0.0.jar \
        --main-class com.konvert.KonvertApplication \
        --type dmg \
        --app-version 1.0.0 \
        --description "Universal Format Converter" \
        --vendor "Konvert"
    
    echo "macOS DMG created in current directory"
    
# Linux
else
    jpackage --input target \
        --name konvert \
        --main-jar konvert-1.0.0.jar \
        --main-class com.konvert.KonvertApplication \
        --type app-image \
        --app-version 1.0.0 \
        --description "Universal Format Converter" \
        --vendor "Konvert"
    
    echo "Linux AppImage created in current directory"
fi

echo "Build complete!"

