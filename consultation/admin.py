from django.contrib import admin
from .models import Consultation, Prescription, LabRequest, ConsultationNote

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'date_time', 'status')
    list_filter = ('status', 'date_time')
    search_fields = ('patient__first_name', 'patient__last_name', 'doctor__user__first_name', 'doctor__user__last_name')

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('consultation', 'medication', 'dosage', 'prescribed_by', 'status')
    list_filter = ('status', 'prescribed_at')
    search_fields = ('medication', 'consultation__patient__first_name', 'consultation__patient__last_name')

@admin.register(LabRequest)
class LabRequestAdmin(admin.ModelAdmin):
    list_display = ('consultation', 'test_name', 'test_type', 'requested_by', 'status')
    list_filter = ('status', 'test_type', 'requested_at')
    search_fields = ('test_name', 'consultation__patient__first_name', 'consultation__patient__last_name')

@admin.register(ConsultationNote)
class ConsultationNoteAdmin(admin.ModelAdmin):
    list_display = ('consultation', 'created_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('consultation__patient__first_name', 'consultation__patient__last_name')
