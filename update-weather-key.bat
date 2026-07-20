@echo off
echo =====================================
echo   Weather API Key Update Tool
echo =====================================
echo.
echo This script will help you update your WEATHER_API_KEY
echo.
set /p apikey="Paste your OpenWeatherMap API key here: "

if "%apikey%"=="" (
    echo.
    echo [ERROR] No API key provided!
    echo.
    pause
    exit /b
)

echo.
echo Updating server\.env file...
echo.

powershell -Command "(Get-Content 'server\.env') -replace 'WEATHER_API_KEY=.*', 'WEATHER_API_KEY=%apikey%' | Set-Content 'server\.env'"

if %errorlevel% equ 0 (
    echo [SUCCESS] API key updated successfully!
    echo.
    echo Your server\.env now contains:
    echo WEATHER_API_KEY=%apikey%
    echo.
    echo Next steps:
    echo 1. Restart your backend server
    echo 2. Wait 10-15 minutes if this is a brand new API key
    echo 3. Test the Weather page
    echo.
) else (
    echo [ERROR] Failed to update .env file!
    echo Make sure you're in the project root directory.
    echo.
)

pause