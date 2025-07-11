#!/bin/bash

echo "Starting Hospital Information Management System Backend..."
echo "=================================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser if it doesn't exist
echo "Setting up admin user..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@hospital.com').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@hospital.com',
        password='admin123',
        first_name='System',
        last_name='Administrator',
        user_type='admin'
    )
    print('Admin user created: admin@hospital.com / admin123')
else:
    print('Admin user already exists')
EOF

# Load sample data
echo "Loading sample data..."
python scripts/setup_database.py

echo ""
echo "Backend setup complete!"
echo "Admin: http://localhost:8000/admin"
echo "API: http://localhost:8000/api"
echo "Login: admin@hospital.com / admin123"
echo ""
echo "Starting development server..."
python manage.py runserver 0.0.0.0:8000
