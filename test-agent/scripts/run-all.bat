@echo off
REM Run all tests for KonvertR Test Agent

setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set TEST_AGENT_DIR=%SCRIPT_DIR%..
set REPORTS_DIR=%TEST_AGENT_DIR%\reports\latest

echo ===============================================================
echo KonvertR Test Agent - Running All Tests
echo ===============================================================
echo.

REM Create reports directory
if not exist "%REPORTS_DIR%" mkdir "%REPORTS_DIR%"

REM Check if application is running
echo Checking if KonvertR is running...
curl -s http://localhost:8080 >nul 2>&1
if errorlevel 1 (
    echo WARNING: KonvertR is not running on http://localhost:8080
    echo Please start it with: mvn spring-boot:run
    echo.
    pause
) else (
    echo KonvertR is running
)

echo.
echo ===============================================================
echo Running Backend Tests
echo ===============================================================
cd /d "%TEST_AGENT_DIR%\backend-tests"
call mvn test -q
if errorlevel 1 echo WARNING: Some backend tests failed

echo.
echo ===============================================================
echo Running Frontend E2E Tests
echo ===============================================================
cd /d "%TEST_AGENT_DIR%\frontend-tests"
call npm test
if errorlevel 1 echo WARNING: Some frontend tests failed

echo.
echo ===============================================================
echo Test Execution Complete
echo ===============================================================
echo.
echo Reports available at:
echo    %REPORTS_DIR%\index.html
echo.
echo Open in browser to view detailed results
pause

