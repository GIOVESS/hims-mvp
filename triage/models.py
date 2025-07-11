from django.db import models
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords
from accounts.models import User
from reception.models import Patient, Appointment, Queue

class TriageRecord(models.Model):
    TRIAGE_LEVEL_CHOICES = (
        (1, 'Level 1 - Resuscitation'),
        (2, 'Level 2 - Emergency'),
        (3, 'Level 3 - Urgent'),
        (4, 'Level 4 - Less Urgent'),
        (5, 'Level 5 - Non-Urgent'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='triage_records')
    queue_entry = models.OneToOneField(Queue, on_delete=models.CASCADE, related_name='triage_record', null=True, blank=True)
    
    # Vital signs
    temperature = models.DecimalField(max_digits=5, decimal_places=2, help_text="Temperature in Celsius")
    pulse_rate = models.PositiveIntegerField(help_text="Pulse rate in BPM")
    respiratory_rate = models.PositiveIntegerField(help_text="Respiratory rate in breaths per minute")
    blood_pressure_systolic = models.PositiveIntegerField()
    blood_pressure_diastolic = models.PositiveIntegerField()
    oxygen_saturation = models.PositiveIntegerField(help_text="SpO2 in percentage")
    weight = models.DecimalField(max_digits=5, decimal_places=2, help_text="Weight in kg")
    height = models.DecimalField(max_digits=5, decimal_places=2, help_text="Height in cm")
    
    # Assessment
    chief_complaint = models.TextField()
    brief_history = models.TextField()
    triage_level = models.IntegerField(choices=TRIAGE_LEVEL_CHOICES)
    
    # System fields
    nurse = models.ForeignKey(User, on_delete=models.CASCADE, related_name='triage_records')
    triage_time = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    
    # Track history
    history = HistoricalRecords()
    
    def __str__(self):
        return f"Triage for {self.patient} on {self.triage_time.strftime('%Y-%m-%d %H:%M')}"
    
    def calculate_bmi(self):
        """Calculate BMI (Body Mass Index)"""
        if self.height and self.weight:
            height_in_meters = self.height / 100
            return round(self.weight / (height_in_meters ** 2), 2)
        return None
    
    class Meta:
        ordering = ['-triage_time']

class TriageNote(models.Model):
    triage_record = models.ForeignKey(TriageRecord, on_delete=models.CASCADE, related_name='triage_notes')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField()
    
    def __str__(self):
        return f"Note for {self.triage_record.patient} by {self.created_by.get_full_name()}"
    
    class Meta:
        ordering = ['-created_at']
