@echo off
REM Alternative run script that uses the compiled JAR
REM This works better if JavaFX Maven plugin has issues

echo Building JAR...
call mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo Build failed!
    exit /b 1
)

echo.
echo Running Konvert...
echo.

REM Run using java command with classpath
java --module-path "%USERPROFILE%\.m2\repository\org\openjfx\javafx-controls\21\javafx-controls-21.jar;%USERPROFILE%\.m2\repository\org\openjfx\javafx-fxml\21\javafx-fxml-21.jar" --add-modules javafx.controls,javafx.fxml -cp "target\konvert-1.0.0.jar;target\dependency\*" com.konvert.KonvertApplication

if %errorlevel% neq 0 (
    echo.
    echo Trying alternative method...
    java -cp "target\konvert-1.0.0.jar" com.konvert.KonvertApplication
)

