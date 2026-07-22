@echo off
echo =============================================
echo  Starting Travel Plans - AI Travel Assistant
echo =============================================
echo.
echo Starting server and client...
echo - Server will run on: http://localhost:5000
echo - Client will run on: http://localhost:3000
echo.
echo Press Ctrl+C in either window to stop
echo.

REM Start server in new window
start "Travel Plans Server" cmd /k "cd /d %~dp0server && npm run dev"

REM Wait 3 seconds then start client
timeout /t 3 /nobreak > nul
start "Travel Plans Client" cmd /k "cd /d %~dp0client && npm start"

echo.
echo Both server and client are starting...
echo Check the opened command windows for status
echo.
pause