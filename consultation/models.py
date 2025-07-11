from django.db import models
from django.conf import settings
from reception.models import Patient, Appointment

class Consultation(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='consultations')
    doctor = models.ForeignKey('accounts.Doctor', on_delete=models.CASCADE, related_name='consultations')
    appointment = models.OneToOneField(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='consultation')
    date_time = models.DateTimeField(auto_now_add=True)
    chief_complaint = models.TextField()
    history_of_present_illness = models.TextField()
    past_medical_history = models.TextField(blank=True)
    medications = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    review_of_systems = models.JSONField(default=dict)
    physical_examination = models.JSONField(default=dict)
    assessment = models.TextField()
    diagnosis = models.TextField()
    plan = models.TextField()
    follow_up = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, default='in_progress')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Consultation: {self.patient} - Dr. {self.doctor.user.last_name} - {self.date_time}"

class Prescription(models.Model):
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='prescriptions')
    medication = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    instructions = models.TextField()
    prescribed_by = models.ForeignKey('accounts.Doctor', on_delete=models.CASCADE, related_name='prescriptions')
    prescribed_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')
    
    def __str__(self):
        return f"{self.medication} - {self.dosage} - {self.frequency}"

class LabRequest(models.Model):
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='lab_requests')
    test_name = models.CharField(max_length=255)
    test_type = models.CharField(max_length=100)
    instructions = models.TextField(blank=True)
    requested_by = models.ForeignKey('accounts.Doctor', on_delete=models.CASCADE, related_name='lab_requests')
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')
    
    def __str__(self):
        return f"{self.test_name} - {self.test_type} - {self.status}"

class ConsultationNote(models.Model):
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='notes')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField()
    
    def __str__(self):
        return f"Note for {self.consultation.patient} by {self.created_by.get_full_name()}"
