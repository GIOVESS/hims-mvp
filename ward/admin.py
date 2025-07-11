from django.contrib import admin
from .models import Ward, Bed, WardStay, VitalSign, NursingTask

@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = ('name', 'ward_type', 'capacity', 'is_active')
    list_filter = ('ward_type', 'is_active')
    search_fields = ('name',)

@admin.register(Bed)
class BedAdmin(admin.ModelAdmin):
    list_display = ('bed_number', 'ward', 'bed_type', 'status', 'is_active')
    list_filter = ('ward', 'bed_type', 'status', 'is_active')
    search_fields = ('bed_number', 'ward__name')

@admin.register(WardStay)
class WardStayAdmin(admin.ModelAdmin):
    list_display = ('patient', 'bed', 'admission_date', 'discharge_date', 'is_active')
    list_filter = ('is_active', 'admission_type', 'admission_date')
    search_fields = ('patient__first_name', 'patient__last_name', 'bed__bed_number')

@admin.register(VitalSign)
class VitalSignAdmin(admin.ModelAdmin):
    list_display = ('ward_stay', 'temperature', 'pulse_rate', 'blood_pressure_systolic', 'recorded_at')
    list_filter = ('recorded_at',)
    search_fields = ('ward_stay__patient__first_name', 'ward_stay__patient__last_name')

@admin.register(NursingTask)
class NursingTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'ward_stay', 'priority', 'status', 'scheduled_time', 'assigned_to')
    list_filter = ('priority', 'status', 'scheduled_time')
    search_fields = ('title', 'ward_stay__patient__first_name', 'ward_stay__patient__last_name')
