@echo off
echo =============================================
echo    Travel Plans - AI Travel Assistant Setup
echo =============================================

echo.
echo 1. Installing dependencies...
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
cd ..

REM Install client dependencies  
echo Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo =============================================
echo Setup complete! 
echo =============================================
echo.
echo NEXT STEPS:
echo 1. Configure your .env files (see CONTRIBUTING.md)
echo 2. Run the start-dev.bat script to start both server and client
echo.
pause