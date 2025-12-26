@echo off
REM Simple run script - builds and runs the application
REM This uses exec:java which is more reliable

echo Building project...
call mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Running Konvert...
echo.

REM Use exec:java which handles classpath automatically
call mvn exec:java -Dexec.mainClass="com.konvert.KonvertApplication" -Dexec.args=""

pause

