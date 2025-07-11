from django.db import models
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords
from accounts.models import User
from reception.models import Patient
from ward.models import WardStay

class Service(models.Model):
    SERVICE_TYPE_CHOICES = (
        ('consultation', 'Consultation'),
        ('procedure', 'Procedure'),
        ('laboratory', 'Laboratory Test'),
        ('imaging', 'Imaging'),
        ('medication', 'Medication'),
        ('accommodation', 'Accommodation'),
        ('other', 'Other'),
    )
    
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES)
    description = models.TextField(blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    is_taxable = models.BooleanField(default=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - ${self.cost}"
    
    class Meta:
        ordering = ['service_type', 'name']

class Invoice(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('partial', 'Partially Paid'),
        ('cancelled', 'Cancelled'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='invoices')
    ward_stay = models.ForeignKey(WardStay, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    
    invoice_number = models.CharField(max_length=20, unique=True)
    date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    notes = models.TextField(blank=True)
    
    # System fields
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_invoices')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Track history
    history = HistoricalRecords()
    
    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.patient}"
    
    class Meta:
        ordering = ['-date']

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.service.name} x {self.quantity} for Invoice #{self.invoice.invoice_number}"
    
    def save(self, *args, **kwargs):
        self.unit_price = self.service.cost
        self.tax_rate = self.service.tax_rate if self.service.is_taxable else 0
        subtotal = self.quantity * self.unit_price
        self.tax_amount = subtotal * (self.tax_rate / 100)
        self.total_amount = subtotal + self.tax_amount
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['service__service_type', 'service__name']

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('mobile_money', 'Mobile Money'),
        ('insurance', 'Insurance'),
        ('other', 'Other'),
    )
    
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    
    payment_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    
    reference_number = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    
    # System fields
    received_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_payments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Track history
    history = HistoricalRecords()
    
    def __str__(self):
        return f"Payment of ${self.amount} for Invoice #{self.invoice.invoice_number}"
    
    class Meta:
        ordering = ['-payment_date']

class InsuranceClaim(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('submitted', 'Submitted'),
        ('in_review', 'In Review'),
        ('approved', 'Approved'),
        ('partially_approved', 'Partially Approved'),
        ('rejected', 'Rejected'),
    )
    
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, related_name='insurance_claim')
    
    claim_number = models.CharField(max_length=50, unique=True)
    insurance_provider = models.CharField(max_length=200)
    policy_number = models.CharField(max_length=100)
    
    amount_claimed = models.DecimalField(max_digits=10, decimal_places=2)
    amount_approved = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    submission_date = models.DateField(null=True, blank=True)
    approval_date = models.DateField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Claim #{self.claim_number} - {self.insurance_provider}"
    
    class Meta:
        ordering = ['-created_at']
