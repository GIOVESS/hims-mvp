#!/bin/bash

# Hospital Information Management System - Backend Setup Script

echo "=== Hospital Information Management System - Backend Setup ==="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 found"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate || source venv/Scripts/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo "✓ Dependencies installed"

# Run migrations
echo "Setting up database..."
python scripts/migrate_database.py

# Create sample data
echo "Creating sample data..."
python scripts/setup_database.py

echo ""
echo "=== Backend Setup Complete ==="
echo ""
echo "Starting Django development server..."
echo "Server will be available at: http://localhost:8000"
echo "Admin interface: http://localhost:8000/admin"
echo "API endpoints: http://localhost:8000/api/"
echo ""
echo "Sample login credentials:"
echo "Admin: admin@hospital.com / admin123"
echo "Doctor: dr.smith@hospital.com / doctor123"
echo "Nurse: nurse.wilson@hospital.com / nurse123"
echo "Receptionist: reception@hospital.com / reception123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the server
python manage.py runserver 0.0.0.0:8000
