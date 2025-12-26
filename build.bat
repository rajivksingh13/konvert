@echo off
REM Build script for Konvert (Windows)
REM Creates executable using jpackage

echo Building Konvert...

REM Clean previous builds
call mvn clean

REM Build JAR
echo Building JAR...
call mvn package

REM Check if build was successful
if %errorlevel% neq 0 (
    echo Maven build failed!
    exit /b 1
)

REM Create jpackage executable
echo Creating native executable with jpackage...

jpackage --input target ^
    --name Konvert ^
    --main-jar konvert-1.0.0.jar ^
    --main-class com.konvert.KonvertApplication ^
    --type exe ^
    --win-dir-chooser ^
    --win-menu ^
    --win-shortcut ^
    --win-menu-group "Konvert" ^
    --app-version 1.0.0 ^
    --description "Universal Format Converter" ^
    --vendor "Konvert"

if %errorlevel% equ 0 (
    echo.
    echo Build complete! Windows executable created in current directory
) else (
    echo.
    echo jpackage failed! Make sure Java 14+ is installed and jpackage is available.
)

