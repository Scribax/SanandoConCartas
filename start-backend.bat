@echo off
title Sanando Con Cartas - Backend Development Server
color 0B
echo.
echo ================================================================
echo  SANANDO CON CARTAS - BACKEND DEVELOPMENT SERVER
echo  MercadoPago Integration & Course Delivery System
echo ================================================================
echo.
echo [INFO] Starting backend development server...
echo [INFO] This handles MercadoPago webhooks and course delivery
echo [INFO] Backend API URL: http://localhost:3000
echo.
echo [TIP] Backend will restart automatically when you save changes
echo [TIP] Check console logs for webhook and email events
echo [TIP] Press Ctrl+C to stop the server
echo.
npm run backend
pause