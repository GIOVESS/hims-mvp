from django.contrib import admin
from .models import Patient, Appointment, Queue

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'phone_number', 'registration_date')
    list_filter = ('gender', 'blood_type', 'registration_date')
    search_fields = ('first_name', 'last_name', 'patient_id', 'phone_number', 'email')
    readonly_fields = ('patient_id', 'registration_date')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'scheduled_date', 'scheduled_time', 'status', 'priority')
    list_filter = ('status', 'priority', 'scheduled_date')
    search_fields = ('patient__first_name', 'patient__last_name', 'doctor__first_name', 'doctor__last_name')

@admin.register(Queue)
class QueueAdmin(admin.ModelAdmin):
    list_display = ('patient', 'department', 'priority', 'status', 'check_in_time')
    list_filter = ('department', 'priority', 'status')
    search_fields = ('patient__first_name', 'patient__last_name')
