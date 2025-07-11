from django.contrib import admin
from .models import Medication, MedicationDispense, Inventory, MedicationTransaction

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'generic_name', 'strength', 'dosage_form', 'stock_level', 'is_active')
    list_filter = ('dosage_form', 'is_controlled', 'is_active')
    search_fields = ('name', 'generic_name', 'brand_name')

@admin.register(MedicationDispense)
class MedicationDispenseAdmin(admin.ModelAdmin):
    list_display = ('patient', 'medication', 'quantity', 'pharmacist', 'status', 'dispensed_at')
    list_filter = ('status', 'dispensed_at')
    search_fields = ('patient__first_name', 'patient__last_name', 'medication__name')

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('medication', 'batch_number', 'expiry_date', 'quantity_current', 'supplier')
    list_filter = ('expiry_date', 'supplier')
    search_fields = ('medication__name', 'batch_number')

@admin.register(MedicationTransaction)
class MedicationTransactionAdmin(admin.ModelAdmin):
    list_display = ('medication', 'transaction_type', 'quantity', 'transaction_date', 'performed_by')
    list_filter = ('transaction_type', 'transaction_date')
    search_fields = ('medication__name',)
