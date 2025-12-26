#!/bin/bash
# Alternative run script that uses the compiled JAR
# This works better if JavaFX Maven plugin has issues

echo "Building JAR..."
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "Running Konvert..."
echo ""

# Try to find JavaFX in Maven repository
JAVAFX_PATH="$HOME/.m2/repository/org/openjfx"
JAVAFX_VERSION="21"

if [ -d "$JAVAFX_PATH" ]; then
    # Run with module path
    java --module-path "$JAVAFX_PATH/javafx-controls/$JAVAFX_VERSION/javafx-controls-$JAVAFX_VERSION.jar:$JAVAFX_PATH/javafx-fxml/$JAVAFX_VERSION/javafx-fxml-$JAVAFX_VERSION.jar" \
         --add-modules javafx.controls,javafx.fxml \
         -cp "target/konvert-1.0.0.jar:target/dependency/*" \
         com.konvert.KonvertApplication
else
    # Fallback: try without module path
    echo "JavaFX not found in Maven repo, trying alternative method..."
    java -cp "target/konvert-1.0.0.jar" com.konvert.KonvertApplication
fi

