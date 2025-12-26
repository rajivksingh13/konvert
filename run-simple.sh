#!/bin/bash
# Simple run script - builds and runs the application
# This uses exec:java which is more reliable

echo "Building project..."
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "Running Konvert..."
echo ""

# Use exec:java which handles classpath automatically
mvn exec:java -Dexec.mainClass="com.konvert.KonvertApplication" -Dexec.args=""

