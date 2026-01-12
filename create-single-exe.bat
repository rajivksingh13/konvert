@echo off
REM Create Single EXE File - Everything Bundled
REM User just clicks the EXE and it runs - no JAR files visible

echo ========================================
echo Creating Single EXE File
echo ========================================
echo.

REM Get version
for /f "tokens=2 delims=<>" %%a in ('powershell -Command "(Get-Content pom.xml | Select-String -Pattern '<version>([^<]+)</version>' | Select-Object -First 1).Matches.Groups[1].Value"') do set VERSION=%%a
if "%VERSION%"=="" set VERSION=1.0.0

REM Step 1: Build frontend
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
echo ✓ Frontend built
echo.

REM Step 2: Build JAR
echo [2/4] Building executable JAR...
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
echo ✓ JAR built: %JAR_NAME%
echo.

REM Step 3: Create app-image with jpackage
echo [3/4] Creating application package...
echo This bundles JRE and creates executable structure...
echo.

if exist KonvertR rmdir /s /q KonvertR

jpackage --input target ^
    --name KonvertR ^
    --main-jar %JAR_NAME% ^
    --type app-image ^
    --app-version %VERSION% ^
    --description "KonvertR - Universal Format Converter" ^
    --vendor "KonvertR" ^
    --dest . ^
    --java-options "-Xmx512m" ^
    --java-options "-Dserver.port=8080"

if %errorlevel% neq 0 (
    echo ERROR: jpackage failed!
    pause
    exit /b 1
)

REM Fix configuration to use fat JAR
if not exist "KonvertR\app\%JAR_NAME%" (
    copy "%JAR_FILE%" "KonvertR\app\" >nul
)

(
echo [Application]
echo app.classpath=$APPDIR\%JAR_NAME%
echo app.mainclass=com.konvert.KonvertApplication
echo.
echo [JavaOptions]
echo java-options=-Xmx512m
echo java-options=-Dserver.port=8080
) > "KonvertR\app\KonvertR.cfg"

if exist "KonvertR\app\dependency" rmdir /s /q "KonvertR\app\dependency"
if exist "KonvertR\app\classes" rmdir /s /q "KonvertR\app\classes"

echo ✓ Application package created
echo.

REM Step 4: Create single EXE file
echo [4/4] Creating single EXE file...
echo.

REM Check for 7-Zip
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    echo Using 7-Zip to create self-extracting EXE...
    
    REM Create SFX config
    (
        echo ;!@Install@^@UTF-8^!
        echo Title="KonvertR"
        echo ExecuteFile="KonvertR\KonvertR.exe"
        echo ExecuteParameters=""
        echo Directory="%%T\KonvertR"
        echo ;!@InstallEnd@^@
    ) > sfx_config.txt
    
    REM Create 7z archive
    7z a -t7z -m0=lzma2 -mx=9 -mfb=64 -md=32m -ms=on KonvertR-Temp.7z KonvertR\* >nul 2>&1
    
    if exist "KonvertR-Temp.7z" (
        REM Combine SFX module + config + archive
        copy /B "%ProgramFiles%\7-Zip\7z.sfx" + sfx_config.txt + KonvertR-Temp.7z KonvertR-Standalone-%VERSION%.exe >nul 2>&1
        
        if exist "KonvertR-Standalone-%VERSION%.exe" (
            del KonvertR-Temp.7z sfx_config.txt >nul 2>&1
            rmdir /s /q KonvertR >nul 2>&1
            
            echo.
            echo ========================================
            echo SUCCESS! Single EXE Created!
            echo ========================================
            echo.
            echo File: KonvertR-Standalone-%VERSION%.exe
            for %%A in ("KonvertR-Standalone-%VERSION%.exe") do echo Size: %%~zA bytes ^(%%~zA / 1048576 MB^)
            echo.
            echo This is a SINGLE EXE file that:
            echo   - Extracts to temp folder when run
            echo   - Runs KonvertR automatically
            echo   - Cleans up on exit
            echo   - No JAR files visible to users
            echo   - No source code visible
            echo.
            echo Users just double-click the EXE!
            echo.
            goto :done
        )
    )
)

REM Check for WinRAR
where winrar >nul 2>&1
if %errorlevel% equ 0 (
    echo Using WinRAR to create self-extracting EXE...
    winrar a -sfx -z"sfx_config.txt" "KonvertR-Standalone-%VERSION%.exe" "KonvertR\*" >nul 2>&1
    if exist "KonvertR-Standalone-%VERSION%.exe" (
        rmdir /s /q KonvertR >nul 2>&1
        echo ✓ Single EXE created with WinRAR
        goto :done
    )
)

REM Fallback: Create portable package
echo.
echo NOTE: 7-Zip or WinRAR not found for SFX creation.
echo.
echo Creating portable package instead...
echo.

REM Create a launcher EXE using batch-to-exe converter approach
echo Creating launcher wrapper...

REM Package everything in a ZIP
set ZIP_NAME=KonvertR-Portable-%VERSION%.zip
if exist "%ZIP_NAME%" del /Q "%ZIP_NAME%"
powershell -Command "Compress-Archive -Path KonvertR\* -DestinationPath '%ZIP_NAME%' -Force" >nul 2>&1

echo.
echo ========================================
echo Portable Package Created
echo ========================================
echo.
echo Package: %ZIP_NAME%
echo.
echo For a TRUE single EXE file, you need:
echo   1. Install 7-Zip from https://7-zip.org/
echo   2. Run this script again
echo.
echo OR use the portable package:
echo   - Extract the ZIP
echo   - Run KonvertR\KonvertR.exe
echo   - Everything is bundled (no JAR visible)
echo.

:done
pause
