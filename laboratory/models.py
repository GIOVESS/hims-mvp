from django.db import models
from django.conf import settings
from reception.models import Patient
from consultation.models import LabRequest

class LabTest(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    test_code = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    turnaround_time = models.IntegerField(help_text="Estimated time in hours")
    sample_type = models.CharField(max_length=100)
    requirements = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.test_code})"

class LabResult(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('verified', 'Verified'),
        ('delivered', 'Delivered'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='lab_results')
    request = models.OneToOneField(LabRequest, on_delete=models.CASCADE, related_name='result')
    test = models.ForeignKey(LabTest, on_delete=models.CASCADE, related_name='results')
    technician = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conducted_tests')
    date_time = models.DateTimeField(auto_now_add=True)
    results = models.JSONField()
    reference_ranges = models.JSONField()
    interpretation = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_tests')
    verified_at = models.DateTimeField(null=True, blank=True)
    report_file = models.FileField(upload_to='lab_reports/', null=True, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Lab Result for {self.patient} - {self.test.name}"

class Sample(models.Model):
    SAMPLE_STATUS = (
        ('collected', 'Collected'),
        ('received', 'Received by Lab'),
        ('processing', 'Processing'),
        ('analyzed', 'Analyzed'),
        ('disposed', 'Disposed'),
    )
    
    lab_request = models.OneToOneField(LabRequest, on_delete=models.CASCADE, related_name='sample')
    sample_id = models.CharField(max_length=50, unique=True)
    sample_type = models.CharField(max_length=100)
    collected_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='collected_samples')
    collected_at = models.DateTimeField(auto_now_add=True)
    received_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_samples', null=True, blank=True)
    received_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=SAMPLE_STATUS, default='collected')
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Sample {self.sample_id} for {self.lab_request.consultation.patient}"
