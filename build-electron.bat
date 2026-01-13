@echo off
REM Build Electron package for Windows
REM This creates KonvertR-Portable-{version}.zip with single EXE

echo ========================================
echo Building KonvertR Electron Package
echo ========================================
echo.

REM Step 1: Build Spring Boot backend
echo [1/6] Building Spring Boot backend...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Spring Boot build failed!
    pause
    exit /b 1
)
echo ✓ Backend built
echo.

REM Step 1b: Prepare backend file (copy JAR to .dat and hide original)
echo [2/6] Preparing backend file...
echo Copying JAR to .dat to hide it from users...
set BACKEND_JAR=
for %%f in (target\konvertr-*.jar) do (
    if not "%%~nf"=="%%~nf-sources" if not "%%~nf"=="%%~nf-javadoc" if not "%%~nf"=="%%~nf-original" if not "%%~nf"=="%%~nf-obfuscated" (
        set BACKEND_JAR=%%f
        copy "%%f" "target\backend.dat" >nul
        echo ✓ Backend file prepared: backend.dat
        echo   Original JAR will be excluded from Electron package
        goto :prepared
    )
)
:prepared
if not defined BACKEND_JAR (
    echo ERROR: No JAR file found to copy!
    pause
    exit /b 1
)
echo.
echo NOTE: Only backend.dat will be included in the Electron package.
echo       Original JAR is excluded for IP protection.
echo.

REM Step 3: Build React frontend
echo [3/6] Building React frontend...
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
echo ✓ Frontend built
echo.

REM Step 4: Install Electron dependencies
echo [4/6] Installing Electron dependencies...
cd electron
if not exist node_modules call npm install
if %errorlevel% neq 0 (
    echo ERROR: Electron dependencies installation failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Electron dependencies installed
echo.

REM Step 5: Verify backend file exists (already created in step 2)
echo [5/6] Verifying backend file...
if exist "target\backend.dat" (
    echo ✓ Backend file ready: backend.dat
) else (
    echo ERROR: Backend file not found!
    pause
    exit /b 1
)
echo.

REM Step 6: Build Electron package
echo [6/6] Building Electron package with obfuscated backend...
echo This may take a few minutes...
echo.
cd electron
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npm run build:win
if %errorlevel% neq 0 (
    echo ERROR: Electron build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo SUCCESS! Electron Package Created!
echo ========================================
echo.

REM Find the created package
for %%f in (dist-electron\KonvertR-Portable-*.zip) do set PACKAGE_FILE=%%f

if exist "%PACKAGE_FILE%" (
    echo Package: %PACKAGE_FILE%
    for %%A in ("%PACKAGE_FILE%") do echo Size: %%~zA bytes ^(%%~zA / 1048576 MB^)
    echo.
    echo This is an Electron package:
    echo   - Single EXE file in ZIP
    echo   - No JAR files visible
    echo   - No source code exposed
    echo   - Click EXE to launch
    echo   - Professional desktop app
    echo.
    echo Users extract ZIP and run KonvertR.exe!
) else (
    echo ERROR: Package not found!
)

pause
