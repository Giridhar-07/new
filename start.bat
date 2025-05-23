@echo off
echo Starting Hotel Management System...
echo.

:: Check if Python and Node.js are installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed! Please install Python 3.8 or higher.
    pause
    exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed! Please install Node.js 14 or higher.
    pause
    exit /b 1
)

:: Start backend server
echo Starting Django backend server...
cd ..\backend
start cmd /k "python -m venv venv & venv\Scripts\activate & pip install -r requirements.txt & python manage.py migrate & python manage.py runserver"

:: Start frontend server
echo Starting React frontend server...
cd ..\frontend
start cmd /k "npm install & npm start"

:: Open browser
timeout /t 10 /nobreak
start http://localhost:3000

echo.
echo Hotel Management System is running!
echo Backend server: http://localhost:8000
echo Frontend server: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause >nul

:: Kill all Node.js and Python processes
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1

echo.
echo All servers have been stopped.
echo Thank you for using Hotel Management System!
timeout /t 3
