@echo off
title Sanando Con Cartas - Development Environment
color 0E
echo.
echo ================================================================
echo  SANANDO CON CARTAS - DEVELOPMENT ENVIRONMENT
echo  Professional Landing Page - $1,000 Price Point
echo ================================================================
echo.
echo This will start BOTH frontend and backend servers:
echo.
echo   Frontend (HTML/CSS/JS): http://localhost:8080
echo   Backend (API/Webhooks):  http://localhost:3000
echo.
echo Choose your option:
echo.
echo [1] Start Frontend Only (for design changes)
echo [2] Start Backend Only (for API testing) 
echo [3] Start Both (full development)
echo [4] Exit
echo.
set /p choice="Enter your choice (1-4): "

if %choice%==1 (
    echo.
    echo Starting Frontend Development Server...
    start "Frontend Server" cmd /k "npm run frontend"
    echo Frontend started at http://localhost:8080
    pause
    exit
)

if %choice%==2 (
    echo.
    echo Starting Backend Development Server...
    start "Backend Server" cmd /k "npm run backend"
    echo Backend started at http://localhost:3000
    pause
    exit
)

if %choice%==3 (
    echo.
    echo Starting Full Development Environment...
    echo.
    start "Frontend Server" cmd /k "color 0A && title Frontend - http://localhost:8080 && npm run frontend"
    timeout /t 2 /nobreak >nul
    start "Backend Server" cmd /k "color 0B && title Backend - http://localhost:3000 && npm run backend"
    echo.
    echo ================================================================
    echo  DEVELOPMENT SERVERS STARTED!
    echo ================================================================
    echo  Frontend: http://localhost:8080
    echo  Backend:  http://localhost:3000
    echo.
    echo  - Open http://localhost:8080 in your browser
    echo  - Make changes to HTML, CSS, JS files
    echo  - Refresh browser to see changes
    echo  - Both servers will auto-restart on file changes
    echo ================================================================
    pause
    exit
)

if %choice%==4 (
    exit
)

echo Invalid choice. Please try again.
pause
goto start