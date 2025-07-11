from django.db import models
from django.conf import settings
from reception.models import Patient
from consultation.models import Prescription

class Medication(models.Model):
    name = models.CharField(max_length=255)
    generic_name = models.CharField(max_length=255)
    brand_name = models.CharField(max_length=255, blank=True)
    dosage_form = models.CharField(max_length=100)  # e.g., tablet, capsule, syrup
    strength = models.CharField(max_length=100)  # e.g., 500mg, 5mg/ml
    manufacturer = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    storage_instructions = models.TextField(blank=True)
    side_effects = models.TextField(blank=True)
    contraindications = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_level = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=10)
    is_controlled = models.BooleanField(default=False)
    requires_prescription = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} {self.strength} {self.dosage_form}"

class MedicationDispense(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('prepared', 'Prepared'),
        ('dispensed', 'Dispensed'),
        ('cancelled', 'Cancelled'),
    )
    
    prescription = models.OneToOneField(Prescription, on_delete=models.CASCADE, related_name='dispense')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medication_dispenses')
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, related_name='dispenses')
    quantity = models.IntegerField()
    instructions = models.TextField()
    pharmacist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='dispensed_medications')
    dispensed_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Dispense: {self.medication} for {self.patient}"

class Inventory(models.Model):
    medication = models.OneToOneField(Medication, on_delete=models.CASCADE, related_name='inventory')
    batch_number = models.CharField(max_length=50)
    expiry_date = models.DateField()
    date_received = models.DateField()
    quantity_received = models.IntegerField()
    quantity_current = models.IntegerField()
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    supplier = models.CharField(max_length=255)
    location = models.CharField(max_length=100, help_text="Storage location in pharmacy")
    last_updated = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Inventory: {self.medication} (Batch: {self.batch_number})"

class MedicationTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('received', 'Received'),
        ('dispensed', 'Dispensed'),
        ('returned', 'Returned'),
        ('expired', 'Expired/Disposed'),
        ('adjusted', 'Inventory Adjustment'),
    )
    
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    batch_number = models.CharField(max_length=50, blank=True)
    transaction_date = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    dispense = models.ForeignKey(MedicationDispense, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.get_transaction_type_display()}: {self.medication} ({self.quantity})"
