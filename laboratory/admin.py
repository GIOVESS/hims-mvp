from django.contrib import admin
from .models import LabTest, LabResult, Sample

@admin.register(LabTest)
class LabTestAdmin(admin.ModelAdmin):
    list_display = ('name', 'test_code', 'category', 'price', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'test_code')

@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ('patient', 'test', 'status', 'date_time', 'technician')
    list_filter = ('status', 'date_time', 'test__category')
    search_fields = ('patient__first_name', 'patient__last_name', 'test__name')

@admin.register(Sample)
class SampleAdmin(admin.ModelAdmin):
    list_display = ('sample_id', 'sample_type', 'status', 'collected_at', 'collected_by')
    list_filter = ('status', 'sample_type', 'collected_at')
    search_fields = ('sample_id', 'lab_request__consultation__patient__first_name')
