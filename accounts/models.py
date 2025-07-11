from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', 'Administrator'),
        ('doctor', 'Doctor'),
        ('nurse', 'Nurse'),
        ('receptionist', 'Receptionist'),
        ('lab_technician', 'Lab Technician'),
        ('pharmacist', 'Pharmacist'),
        ('accountant', 'Accountant'),
    )
    
    email = models.EmailField(_('email address'), unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    phone_number = PhoneNumberField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
    # Additional fields
    department = models.CharField(max_length=100, blank=True)
    employee_id = models.CharField(max_length=50, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'user_type']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['first_name', 'last_name']

class Department(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    head = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='department_head')
    
    def __str__(self):
        return self.name

class Doctor(models.Model):
    SPECIALTY_CHOICES = (
        ('general', 'General Medicine'),
        ('cardiology', 'Cardiology'),
        ('neurology', 'Neurology'),
        ('orthopedics', 'Orthopedics'),
        ('pediatrics', 'Pediatrics'),
        ('surgery', 'Surgery'),
        ('emergency', 'Emergency Medicine'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty = models.CharField(max_length=50, choices=SPECIALTY_CHOICES)
    license_number = models.CharField(max_length=100)
    years_of_experience = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name()}"
    
    def get_specialty_display(self):
        return dict(self.SPECIALTY_CHOICES).get(self.specialty, self.specialty)
