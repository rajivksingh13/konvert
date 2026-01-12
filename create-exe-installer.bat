@echo off
REM Create Installer EXE (True Single File)
REM Requires WiX Toolset - Creates professional installer

echo ========================================
echo Creating Installer EXE
echo ========================================
echo.
echo This creates a single EXE installer file.
echo Users run the installer and app is installed.
echo.
echo REQUIREMENT: WiX Toolset must be installed
echo Download from: https://wixtoolset.org/releases/
echo.

REM Check for WiX
where candle >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: WiX Toolset not found!
    echo.
    echo Please install WiX Toolset:
    echo   1. Download from: https://wixtoolset.org/releases/
    echo   2. Install WiX Toolset v3.11 or later
    echo   3. Add to PATH: C:\Program Files (x86)\WiX Toolset v3.11\bin
    echo   4. Restart command prompt
    echo.
    pause
    exit /b 1
)

echo ✓ WiX Toolset found
echo.

REM Get version
for /f "tokens=2 delims=<>" %%a in ('powershell -Command "(Get-Content pom.xml | Select-String -Pattern '<version>([^<]+)</version>' | Select-Object -First 1).Matches.Groups[1].Value"') do set VERSION=%%a
if "%VERSION%"=="" set VERSION=1.0.0

REM Build frontend
echo [1/4] Building frontend...
cd frontend
if not exist node_modules call npm install
call npm run build:deploy
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

REM Build JAR
echo [2/4] Building JAR...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

REM Find JAR
set JAR_FILE=
for %%f in (target\konvertr-*.jar) do (
    if not "%%~nf"=="%%~nf-sources" if not "%%~nf"=="%%~nf-javadoc" if not "%%~nf"=="%%~nf-original" (
        set JAR_FILE=%%f
        goto :found
    )
)
:found
if not exist "%JAR_FILE%" (
    echo ERROR: JAR not found!
    pause
    exit /b 1
)

for %%f in ("%JAR_FILE%") do set JAR_NAME=%%~nxf

REM Clean previous
if exist KonvertR*.exe del /Q KonvertR*.exe

REM Create installer EXE
echo [3/4] Creating installer EXE...
echo This may take 5-10 minutes...
echo.

jpackage --input target ^
    --name KonvertR ^
    --main-jar %JAR_NAME% ^
    --type exe ^
    --app-version %VERSION% ^
    --description "KonvertR - Universal Format Converter" ^
    --vendor "KonvertR" ^
    --copyright "Copyright 2024 KonvertR" ^
    --win-dir-chooser ^
    --win-menu ^
    --win-shortcut ^
    --win-menu-group "KonvertR" ^
    --win-per-user-install ^
    --dest . ^
    --java-options "-Xmx512m" ^
    --java-options "-Dserver.port=8080"

if %errorlevel% neq 0 (
    echo ERROR: jpackage failed!
    pause
    exit /b 1
)

REM Find created EXE
set EXE_FILE=
for %%f in (KonvertR*.exe) do set EXE_FILE=%%f

if exist "%EXE_FILE%" (
    echo.
    echo ========================================
    echo Installer EXE Created!
    echo ========================================
    echo.
    echo File: %EXE_FILE%
    for %%A in ("%EXE_FILE%") do echo Size: %%~zA bytes ^(%%~zA / 1048576 MB^)
    echo.
    echo This is a SINGLE EXE installer:
    echo   - Users double-click to install
    echo   - Installs to Program Files
    echo   - Creates Start Menu shortcut
    echo   - No JAR files visible
    echo   - No source code visible
    echo   - Everything bundled
    echo.
) else (
    echo ERROR: EXE not found!
)

pause
