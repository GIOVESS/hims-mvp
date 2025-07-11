from django.db import models
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords
from accounts.models import User, Doctor
from reception.models import Patient

class Ward(models.Model):
    WARD_TYPE_CHOICES = (
        ('general', 'General Ward'),
        ('private', 'Private Room'),
        ('icu', 'Intensive Care Unit'),
        ('pediatric', 'Pediatric Ward'),
        ('maternity', 'Maternity Ward'),
        ('psychiatric', 'Psychiatric Ward'),
        ('isolation', 'Isolation Ward'),
    )
    
    name = models.CharField(max_length=100)
    ward_type = models.CharField(max_length=20, choices=WARD_TYPE_CHOICES)
    capacity = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    
    # Responsible staff
    head_nurse = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='headed_wards')
    
    # System fields
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_ward_type_display()})"
    
    def get_available_beds(self):
        return self.beds.filter(status='available', is_active=True).count()
    
    def get_occupancy_rate(self):
        total_active_beds = self.beds.filter(is_active=True).count()
        if total_active_beds == 0:
            return 0
        occupied_beds = self.beds.filter(status='occupied', is_active=True).count()
        return (occupied_beds / total_active_beds) * 100
    
    class Meta:
        ordering = ['name']

class Bed(models.Model):
    BED_STATUS = (
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('maintenance', 'Under Maintenance'),
        ('reserved', 'Reserved'),
    )
    
    BED_TYPE_CHOICES = (
        ('standard', 'Standard'),
        ('icu', 'ICU'),
        ('isolation', 'Isolation'),
        ('pediatric', 'Pediatric'),
    )
    
    ward = models.ForeignKey(Ward, on_delete=models.CASCADE, related_name='beds')
    bed_number = models.CharField(max_length=20)
    bed_type = models.CharField(max_length=20, choices=BED_TYPE_CHOICES, default='standard')
    status = models.CharField(max_length=20, choices=BED_STATUS, default='available')
    description = models.TextField(blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Bed {self.bed_number} in {self.ward.name}"
    
    class Meta:
        ordering = ['ward', 'bed_number']
        unique_together = ['ward', 'bed_number']

class WardStay(models.Model):
    ADMISSION_TYPE_CHOICES = (
        ('emergency', 'Emergency'),
        ('elective', 'Elective'),
        ('transfer', 'Transfer'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='ward_stays')
    bed = models.ForeignKey(Bed, on_delete=models.CASCADE, related_name='ward_stays')
    
    # Admission details
    admission_date = models.DateTimeField()
    expected_discharge_date = models.DateField(null=True, blank=True)
    discharge_date = models.DateTimeField(null=True, blank=True)
    admission_type = models.CharField(max_length=20, choices=ADMISSION_TYPE_CHOICES, default='elective')
    
    # Staff responsible
    admitting_doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='admitted_patients')
    attending_doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='attending_patients')
    discharged_by = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name='discharged_patients')
    
    # Medical information
    admission_diagnosis = models.TextField()
    discharge_diagnosis = models.TextField(blank=True)
    discharge_instructions = models.TextField(blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    
    # System fields
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_ward_stays')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Track history
    history = HistoricalRecords()
    
    def __str__(self):
        return f"{self.patient} - {self.bed} ({'Active' if self.is_active else 'Discharged'})"
    
    class Meta:
        ordering = ['-admission_date']

class VitalSign(models.Model):
    ward_stay = models.ForeignKey(WardStay, on_delete=models.CASCADE, related_name='vital_signs')
    
    # Vital measurements
    temperature = models.DecimalField(max_digits=5, decimal_places=2, help_text="Temperature in Celsius")
    pulse_rate = models.PositiveIntegerField(help_text="Pulse rate in BPM")
    respiratory_rate = models.PositiveIntegerField(help_text="Respiratory rate in breaths per minute")
    blood_pressure_systolic = models.PositiveIntegerField()
    blood_pressure_diastolic = models.PositiveIntegerField()
    oxygen_saturation = models.PositiveIntegerField(help_text="SpO2 in percentage")
    
    # System fields
    recorded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recorded_vitals')
    recorded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Vitals for {self.ward_stay.patient} on {self.recorded_at.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        ordering = ['-recorded_at']

class NursingTask(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    ward_stay = models.ForeignKey(WardStay, on_delete=models.CASCADE, related_name='nursing_tasks')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    # Scheduling
    scheduled_time = models.DateTimeField()
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Staff assignment
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_nursing_tasks')
    completed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='completed_nursing_tasks')
    
    # System fields
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_nursing_tasks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.title} for {self.ward_stay.patient}"
    
    class Meta:
        ordering = ['scheduled_time']
