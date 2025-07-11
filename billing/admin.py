from django.contrib import admin
from .models import Service, Invoice, InvoiceItem, Payment, InsuranceClaim

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'service_type', 'cost', 'is_active')
    list_filter = ('service_type', 'is_active', 'is_taxable')
    search_fields = ('name', 'code')

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'patient', 'date', 'total_amount', 'status')
    list_filter = ('status', 'date')
    search_fields = ('invoice_number', 'patient__first_name', 'patient__last_name')

@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'service', 'quantity', 'unit_price', 'total_amount')
    list_filter = ('service__service_type',)
    search_fields = ('invoice__invoice_number', 'service__name')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'amount', 'payment_method', 'payment_date', 'received_by')
    list_filter = ('payment_method', 'payment_date')
    search_fields = ('invoice__invoice_number', 'reference_number')

@admin.register(InsuranceClaim)
class InsuranceClaimAdmin(admin.ModelAdmin):
    list_display = ('claim_number', 'insurance_provider', 'amount_claimed', 'status')
    list_filter = ('status', 'insurance_provider')
    search_fields = ('claim_number', 'policy_number')
