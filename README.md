# Hospital Information Management System (HIMS)

![Django](https://img.shields.io/badge/Django-4.2-brightgreen)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)

A comprehensive Django-based Hospital Information Management System.

## Features

- Patient registration and profile management
- Triage system with priority levels
- Doctor consultation module
- Laboratory test ordering and results
- Pharmacy prescription management
- Ward admission and discharge
- Automated billing system
- Modern admin interface (Jazzmin)
- Role-based access control

## Setup Instructions

### Prerequisites

- Python 3.10+
- PostgreSQL 13+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GIOVESS/hims-mvp.git
   cd hims-mvp
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate    # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and other settings.

5. Set up the database:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```


### Running the Development Server

 Start the development server:
   ```bash
   python manage.py runserver
   ```

The application will be available at `http://localhost:8000`


## Project Structure

```
hims-mvp/
├── accounts/          # User authentication and profiles
├── reception/         # Patient registration
├── triage/            # Patient triage system
├── consultation/      # Doctor consultations
├── laboratory/        # Lab test management
├── pharmacy/          # Prescription system
├── ward/              # Ward admissions
├── billing/           # Billing and payments
├── config/            # Project configuration
├── templates/         # Base templates
├── static/            # Static files
└── requirements.txt   # Python dependencies
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
