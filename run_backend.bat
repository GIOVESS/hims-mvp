@echo off
REM Hospital Information Management System - Backend Setup Script

echo === Hospital Information Management System - Backend Setup ===
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo ✓ Python found

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

echo ✓ Dependencies installed

REM Run migrations
echo Setting up database...
python scripts/migrate_database.py

REM Create sample data
echo Creating sample data...
python scripts/setup_database.py

echo.
echo === Backend Setup Complete ===
echo.
echo Starting Django development server...
echo Server will be available at: http://localhost:8000
echo Admin interface: http://localhost:8000/admin
echo API endpoints: http://localhost:8000/api/
echo.
echo Sample login credentials:
echo Admin: admin@hospital.com / admin123
echo Doctor: dr.smith@hospital.com / doctor123
echo Nurse: nurse.wilson@hospital.com / nurse123
echo Receptionist: reception@hospital.com / reception123
echo.
echo Press Ctrl+C to stop the server
echo.

REM Run the server
python manage.py runserver 0.0.0.0:8000
