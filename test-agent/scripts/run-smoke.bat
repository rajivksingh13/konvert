@echo off
REM Run smoke tests (critical path only)

set SCRIPT_DIR=%~dp0
set TEST_AGENT_DIR=%SCRIPT_DIR%..

echo Running Smoke Tests (Critical Path Only)
echo.

cd /d "%TEST_AGENT_DIR%\frontend-tests"
call npm run test:smoke

echo.
echo Smoke tests complete
pause

