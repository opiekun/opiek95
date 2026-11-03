@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required to run the local preview. Install Node.js, then run this file again.
  pause
  exit /b 1
)
set "HOST=0.0.0.0"
node server.mjs
if errorlevel 1 pause
endlocal
