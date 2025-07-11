# Hospital Information Management System (HIMS)

A comprehensive web-based Hospital Information Management System built with Django, PostgreSQL, and Tailwind CSS. Designed to optimize hospital workflows, improve patient care, and enhance administrative efficiency.

##  Features

### Core Modules (Implemented)
- **Dashboard** - Real-time hospital overview with key metrics and analytics
- **Patient Management** - Registration, check-in, and medical history tracking
- **Reception** - Patient registration and queue management
- **Triage** - Patient assessment and priority management
- **Consultation** - Doctor-patient consultation management
- **Laboratory** - Test ordering, processing, and results management
- **Pharmacy** - Prescription management and inventory tracking
- **Ward Management** - Bed allocation and patient admissions
- **Billing** - Invoice generation, payment processing, and financial tracking
- **Reports** - Analytics and data visualization
- **Appointments** - Scheduling and calendar management
- **Notifications** - Real-time alerts and messaging via WebSockets

### Technical Features (Implemented)
- **Modern UI** - Responsive design with Tailwind CSS and shadcn/ui components
- **Real-time Notifications** - WebSocket-based live notifications
- **Secure Authentication** - JWT-based authentication with role-based access control
- **Database Management** - PostgreSQL with Django ORM and migrations
- **API Integration** - RESTful API with Django REST Framework
- **Mobile Responsive** - Optimized for all device sizes
- **Dark/Light Theme** - Theme switching capability
- **Data Visualization** - Interactive charts and analytics
- **Audit Trail** - Comprehensive history tracking with django-simple-history

### Future Development Plans
- **SMS Integration** - Appointment reminders and notifications via SMS
- **Advanced Analytics** - Machine learning-powered insights and predictions
- **Telemedicine** - Video consultation capabilities
- **Mobile Application** - React Native mobile app
- **AI Diagnostics** - AI-powered diagnostic assistance
- **Multi-language Support** - Internationalization (i18n)
- **Advanced Security** - Enhanced encryption and security features
- **Integration APIs** - Third-party medical device and system integrations
- **Advanced Reporting** - Custom report builder and advanced analytics
- **Inventory Management** - Advanced pharmacy and medical supply tracking

##  Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 18.0 or higher
- PostgreSQL 12 or higher
- Redis (for caching and WebSockets)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GIOVESS/hims-mvp.git
   cd hims-mvp
   ```

2. **Set up the backend (Django)**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Configure database**
   ```bash
   # Set up PostgreSQL database
   # Update DATABASE_URL in settings.py or use environment variables
   
   # Run migrations
   python manage.py makemigrations
   python manage.py migrate
   
   # Create superuser
   python manage.py createsuperuser
   
   # Load sample data
   python scripts/setup_database.py
   ```

4. **Set up the frontend (Next.js)**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Create environment file
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start the development servers**
   ```bash
   # Start Django backend (Terminal 1)
   python manage.py runserver 0.0.0.0:8000
   
   # Start Next.js frontend (Terminal 2)
   npm run dev
   ```

6. **Access the application**
   - **Frontend Dashboard**: http://localhost:3000
   - **Backend Admin**: http://localhost:8000/admin
   - **API Documentation**: http://localhost:8000/api

### Demo Login Credentials
- **Admin**: admin@hospital.com / admin123
- **Doctor**: dr.smith@hospital.com / doctor123
- **Nurse**: nurse.wilson@hospital.com / nurse123
- **Receptionist**: reception@hospital.com / reception123

##  Architecture

### Backend Stack
- **Django 4.2** - Web framework with built-in admin interface
- **PostgreSQL** - Primary database for data persistence
- **Redis** - Caching and WebSocket support
- **Django REST Framework** - API development
- **Channels** - WebSocket support for real-time features
- **JWT Authentication** - Secure token-based authentication
- **Django Simple History** - Audit trail and data versioning

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Key Features
- **Component-based architecture** - Modular, reusable components
- **Custom hooks** - Shared logic and state management
- **API abstraction** - Centralized API client with error handling
- **Type-safe development** - Full TypeScript coverage
- **Responsive design** - Mobile-first approach
- **Real-time updates** - WebSocket integration for live data

##  Database Schema

### Core Models
- **User Management** - Custom user model with role-based permissions
- **Patient Records** - Comprehensive patient information and medical history
- **Appointments** - Scheduling and appointment management
- **Medical Services** - Laboratory tests, procedures, and treatments
- **Billing System** - Invoices, payments, and insurance claims
- **Ward Management** - Bed allocation and patient admissions
- **Notifications** - Real-time alerts and messaging

### Data Relationships
- Patients have multiple appointments and medical records
- Users (staff) are assigned to departments and roles
- Services are linked to billing and invoices
- Wards contain beds with patient stays
- Notifications are sent to specific users or departments

##  Configuration

### Environment Variables

Create a `.env.local` file for frontend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_APP_NAME=Hospital Management System
```

Create a `.env` file for backend:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Database Configuration

For PostgreSQL in `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'hospital_db',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

##  Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services Included
- **Frontend** - Next.js application (port 3000)
- **Backend** - Django API server (port 8000)
- **Database** - PostgreSQL (port 5432)
- **Cache** - Redis (port 6379)
- **Proxy** - Nginx reverse proxy (port 80/443)

##  Development

### Available Scripts

```bash
# Backend (Django)
python manage.py runserver          # Start development server
python manage.py makemigrations     # Create migrations
python manage.py migrate            # Apply migrations
python manage.py collectstatic      # Collect static files
python manage.py test               # Run tests

# Frontend (Next.js)
npm run dev                         # Start development server
npm run build                       # Build for production
npm run start                       # Start production server
npm run lint                        # Run ESLint
npm run type-check                  # TypeScript type checking
```

### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **Django Code Style** - PEP 8 compliance
- **Black** - Python code formatting

##  Security Features

### Implemented Security
- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - User permissions and authorization
- **CORS Configuration** - Cross-origin resource sharing
- **Input Validation** - Data sanitization and validation
- **SQL Injection Protection** - Django ORM security
- **XSS Protection** - Content Security Policy headers

### Security Headers
```javascript
// next.config.mjs
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ]
}
```

##  Performance Optimization

### Backend Optimizations
- **Database Indexing** - Optimized queries and relationships
- **Caching** - Redis-based caching for frequently accessed data
- **API Pagination** - Efficient data loading
- **Database Connection Pooling** - Optimized database connections

### Frontend Optimizations
- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Bundle Analysis** - Webpack bundle analyzer
- **Lazy Loading** - Component and route lazy loading

##  Testing

### Test Structure
```
__tests__/
├── components/     # Component tests
├── pages/         # Page tests
├── utils/         # Utility function tests
└── integration/   # Integration tests
```

### Running Tests
```bash
# Frontend tests
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report

# Backend tests
python manage.py test     # Run Django tests
```

##  Monitoring and Analytics

### Implemented Monitoring
- **Error Tracking** - Comprehensive error logging
- **Performance Metrics** - Response time monitoring
- **User Analytics** - Usage patterns and behavior
- **Database Monitoring** - Query performance and optimization

### Future Monitoring Plans
- **Application Performance Monitoring (APM)**
- **Real-time Dashboard** - Live system health monitoring
- **Alert System** - Automated notifications for issues
- **Log Aggregation** - Centralized logging system

##  Deployment

### Production Checklist
1. **Environment Setup**
   - Configure production environment variables
   - Set up SSL certificates
   - Configure database connections
   - Set up Redis for caching

2. **Security Configuration**
   - Enable HTTPS enforcement
   - Configure security headers
   - Set up firewall rules
   - Enable rate limiting

3. **Performance Optimization**
   - Enable database connection pooling
   - Configure CDN for static files
   - Set up caching strategies
   - Optimize image delivery

### Deployment Platforms
- **Docker** - Containerized deployment (recommended)
- **Vercel** - Frontend deployment
- **Heroku** - Full-stack deployment
- **AWS** - Cloud infrastructure
- **Traditional Hosting** - VPS or dedicated servers

##  Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use meaningful variable and function names
- Write comprehensive comments
- Maintain consistent formatting
- Add tests for new functionality
- Follow Django coding conventions

##  Roadmap

### Version 1.1 (Current)
-  Core hospital management modules
-  Real-time notifications
-  User authentication and authorization
-  Basic reporting and analytics
-  Responsive web interface

### Version 1.2 (Next)
-  SMS integration for appointment reminders
-  Advanced reporting dashboard
-  Enhanced security features
-  Performance optimizations
-  Mobile-responsive improvements

### Version 2.0 (Future)
-  Telemedicine capabilities
-  Mobile application (React Native)
-  AI-powered diagnostics
-  Advanced analytics and ML
-  Multi-language support
-  Third-party integrations

### Version 3.0 (Long-term)
-  Blockchain for medical records
-  IoT device integration
-  Advanced AI/ML features
-  Cloud-native architecture
-  Microservices architecture



##  Support

### Getting Help
- **Documentation** - Check this README and inline comments
- **Issues** - Create a GitHub issue for bugs or feature requests
- **Discussions** - Use GitHub Discussions for questions
- **Email** - Contact the development team

### Common Issues
1. **Database Connection** - Check PostgreSQL configuration
2. **Port Conflicts** - Ensure ports 3000 and 8000 are available
3. **Environment Variables** - Verify all required variables are set
4. **Dependencies** - Run `pip install -r requirements.txt` and `npm install`

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


