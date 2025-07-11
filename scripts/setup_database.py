#!/usr/bin/env python
"""
Script to set up the database with initial data
"""
import os
import sys
import django
from datetime import date, datetime, timedelta
from django.utils import timezone

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hims_project.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import Department, Doctor
from reception.models import Patient, Appointment, Queue
from ward.models import Ward, Bed, WardStay
from billing.models import Service, Invoice, InvoiceItem, Payment
from notifications.models import Notification

User = get_user_model()

def create_sample_data():
    print("Creating sample data...")
    
    # Create superuser
    if not User.objects.filter(email='admin@hospital.com').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@hospital.com',
            password='admin123',
            first_name='System',
            last_name='Administrator',
            user_type='admin'
        )
        print("Created admin user: admin@hospital.com / admin123")
    
    # Create departments
    departments = [
        {'name': 'Emergency', 'description': 'Emergency Department'},
        {'name': 'Cardiology', 'description': 'Heart and cardiovascular care'},
        {'name': 'Neurology', 'description': 'Brain and nervous system care'},
        {'name': 'Orthopedics', 'description': 'Bone and joint care'},
        {'name': 'Pediatrics', 'description': 'Children healthcare'},
    ]
    
    for dept_data in departments:
        dept, created = Department.objects.get_or_create(
            name=dept_data['name'],
            defaults={'description': dept_data['description']}
        )
        if created:
            print(f"Created department: {dept.name}")
    
    # Create sample users
    users_data = [
        {
            'username': 'dr.smith',
            'email': 'dr.smith@hospital.com',
            'password': 'doctor123',
            'first_name': 'John',
            'last_name': 'Smith',
            'user_type': 'doctor',
            'department': 'Cardiology'
        },
        {
            'username': 'dr.johnson',
            'email': 'dr.johnson@hospital.com',
            'password': 'doctor123',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'user_type': 'doctor',
            'department': 'Emergency'
        },
        {
            'username': 'nurse.wilson',
            'email': 'nurse.wilson@hospital.com',
            'password': 'nurse123',
            'first_name': 'Emily',
            'last_name': 'Wilson',
            'user_type': 'nurse',
            'department': 'Emergency'
        },
        {
            'username': 'receptionist',
            'email': 'reception@hospital.com',
            'password': 'reception123',
            'first_name': 'Maria',
            'last_name': 'Garcia',
            'user_type': 'receptionist',
            'department': 'Reception'
        }
    ]
    
    for user_data in users_data:
        if not User.objects.filter(email=user_data['email']).exists():
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                user_type=user_data['user_type'],
                department=user_data['department']
            )
            print(f"Created user: {user.email}")
            
            # Create doctor profiles for doctors
            if user.user_type == 'doctor':
                specialty_map = {
                    'Cardiology': 'cardiology',
                    'Emergency': 'emergency',
                    'Neurology': 'neurology',
                    'Orthopedics': 'orthopedics',
                    'Pediatrics': 'pediatrics'
                }
                
                doctor, created = Doctor.objects.get_or_create(
                    user=user,
                    defaults={
                        'specialty': specialty_map.get(user.department, 'general'),
                        'license_number': f'LIC{user.id:06d}',
                        'years_of_experience': 5
                    }
                )
                if created:
                    print(f"Created doctor profile for: {user.get_full_name()}")
    
    # Create sample patients
    patients_data = [
        {
            'first_name': 'Alice',
            'last_name': 'Brown',
            'date_of_birth': date(1985, 3, 15),
            'gender': 'F',
            'blood_type': 'A+',
            'phone_number': '+1234567890',
            'email': 'alice.brown@email.com'
        },
        {
            'first_name': 'Bob',
            'last_name': 'Davis',
            'date_of_birth': date(1978, 7, 22),
            'gender': 'M',
            'blood_type': 'O+',
            'phone_number': '+1234567891',
            'email': 'bob.davis@email.com'
        },
        {
            'first_name': 'Carol',
            'last_name': 'Miller',
            'date_of_birth': date(1992, 11, 8),
            'gender': 'F',
            'blood_type': 'B+',
            'phone_number': '+1234567892',
            'email': 'carol.miller@email.com'
        },
        {
            'first_name': 'David',
            'last_name': 'Wilson',
            'date_of_birth': date(1965, 5, 30),
            'gender': 'M',
            'blood_type': 'AB+',
            'phone_number': '+1234567893',
            'email': 'david.wilson@email.com'
        }
    ]
    
    for i, patient_data in enumerate(patients_data, 1):
        if not Patient.objects.filter(email=patient_data['email']).exists():
            patient = Patient.objects.create(
                patient_id=f'P{i:06d}',
                **patient_data
            )
            print(f"Created patient: {patient.get_full_name()}")
    
    # Create wards and beds
    wards_data = [
        {'name': 'General Ward A', 'ward_type': 'general', 'capacity': 20},
        {'name': 'ICU', 'ward_type': 'icu', 'capacity': 10},
        {'name': 'Private Rooms', 'ward_type': 'private', 'capacity': 15},
        {'name': 'Pediatric Ward', 'ward_type': 'pediatric', 'capacity': 12},
    ]
    
    for ward_data in wards_data:
        ward, created = Ward.objects.get_or_create(
            name=ward_data['name'],
            defaults={
                'ward_type': ward_data['ward_type'],
                'capacity': ward_data['capacity']
            }
        )
        if created:
            print(f"Created ward: {ward.name}")
            
            # Create beds for this ward
            for bed_num in range(1, ward_data['capacity'] + 1):
                bed_number = f"{ward.name.split()[0][:3].upper()}-{bed_num:02d}"
                bed, bed_created = Bed.objects.get_or_create(
                    ward=ward,
                    bed_number=bed_number,
                    defaults={
                        'bed_type': 'icu' if ward.ward_type == 'icu' else 'standard',
                        'status': 'occupied' if bed_num <= 3 else 'available'  # Some beds occupied
                    }
                )
                if bed_created:
                    print(f"Created bed: {bed.bed_number}")
    
    # Create sample services
    services_data = [
        {'name': 'General Consultation', 'code': 'CONS001', 'service_type': 'consultation', 'cost': 150.00},
        {'name': 'Emergency Consultation', 'code': 'CONS002', 'service_type': 'consultation', 'cost': 300.00},
        {'name': 'Blood Test', 'code': 'LAB001', 'service_type': 'laboratory', 'cost': 75.00},
        {'name': 'X-Ray', 'code': 'IMG001', 'service_type': 'imaging', 'cost': 200.00},
        {'name': 'Room Charge (General)', 'code': 'ROOM001', 'service_type': 'accommodation', 'cost': 250.00},
        {'name': 'Room Charge (ICU)', 'code': 'ROOM002', 'service_type': 'accommodation', 'cost': 500.00},
    ]
    
    for service_data in services_data:
        service, created = Service.objects.get_or_create(
            code=service_data['code'],
            defaults=service_data
        )
        if created:
            print(f"Created service: {service.name}")
    
    # Create sample appointments and queue entries
    doctors = User.objects.filter(user_type='doctor')
    patients = Patient.objects.all()
    receptionist = User.objects.filter(user_type='receptionist').first()
    
    if doctors.exists() and patients.exists() and receptionist:
        today = timezone.now().date()
        
        for i, patient in enumerate(patients[:3]):  # Create appointments for first 3 patients
            appointment = Appointment.objects.create(
                patient=patient,
                doctor=doctors[i % doctors.count()],
                scheduled_date=today,
                scheduled_time=timezone.now().time(),
                reason=f"Regular checkup for {patient.get_full_name()}",
                status='checked_in' if i < 2 else 'scheduled',
                priority='normal',
                created_by=receptionist
            )
            print(f"Created appointment: {appointment}")
            
            # Create queue entries for checked-in patients
            if appointment.status == 'checked_in':
                queue_entry = Queue.objects.create(
                    patient=patient,
                    appointment=appointment,
                    department=appointment.doctor.department or 'General',
                    priority='normal' if i == 0 else 'urgent',
                    status='waiting'
                )
                print(f"Created queue entry: {queue_entry}")
    
    # Create sample payments for revenue data
    invoices = Invoice.objects.all()
    if not invoices.exists():
        # Create sample invoices and payments
        patients = Patient.objects.all()[:2]
        services = Service.objects.all()[:3]
        admin_user = User.objects.filter(user_type='admin').first()
        
        if patients.exists() and services.exists() and admin_user:
            for i, patient in enumerate(patients):
                invoice = Invoice.objects.create(
                    patient=patient,
                    invoice_number=f'INV{timezone.now().strftime("%Y%m%d")}{i+1:03d}',
                    due_date=timezone.now().date() + timedelta(days=30),
                    status='paid',
                    created_by=admin_user
                )
                
                # Add invoice items
                total = 0
                for service in services[:2]:  # Add 2 services per invoice
                    item = InvoiceItem.objects.create(
                        invoice=invoice,
                        service=service,
                        quantity=1,
                        unit_price=service.cost,
                        total_amount=service.cost
                    )
                    total += service.cost
                
                invoice.amount = total
                invoice.total_amount = total
                invoice.amount_paid = total
                invoice.balance = 0
                invoice.save()
                
                # Create payment
                payment = Payment.objects.create(
                    invoice=invoice,
                    amount=total,
                    payment_method='cash',
                    received_by=admin_user
                )
                print(f"Created invoice and payment: {invoice.invoice_number}")
    
    print("Sample data creation completed!")

if __name__ == '__main__':
    create_sample_data()
