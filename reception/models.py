from django.db import models
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords
from accounts.models import User

class Patient(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    
    BLOOD_GROUP_CHOICES = (
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    )
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    blood_type = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)
    
    # Contact Information
    email = models.EmailField(blank=True, null=True)
    phone_number = PhoneNumberField()
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = PhoneNumberField(blank=True)
    
    # Address
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    # Medical Information
    allergies = models.TextField(blank=True)
    chronic_diseases = models.TextField(blank=True)
    
    # System fields
    patient_id = models.CharField(max_length=20, unique=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    last_visit_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Track history
    history = HistoricalRecords()
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.patient_id})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def age(self):
        from datetime import date
        today = date.today()
        born = self.date_of_birth
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))
    
    class Meta:
        ordering = ['-registration_date']

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('checked_in', 'Checked In'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    )
    
    PRIORITY_CHOICES = (
        ('normal', 'Normal'),
        ('urgent', 'Urgent'),
        ('emergency', 'Emergency'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    reason = models.TextField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_appointments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    notes = models.TextField(blank=True)
    
    # Track history
    history = HistoricalRecords()
    
    def __str__(self):
        return f"{self.patient} - {self.scheduled_date} {self.scheduled_time}"
    
    class Meta:
        ordering = ['scheduled_date', 'scheduled_time']

class Queue(models.Model):
    PRIORITY_CHOICES = (
        ('normal', 'Normal'),
        ('urgent', 'Urgent'),
        ('emergency', 'Emergency'),
    )
    
    STATUS_CHOICES = (
        ('waiting', 'Waiting'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='queue_entries')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='queue_entries', null=True, blank=True)
    department = models.CharField(max_length=100)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    check_in_time = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.patient} - {self.department} ({self.priority})"
    
    class Meta:
        ordering = ['priority', 'check_in_time']
