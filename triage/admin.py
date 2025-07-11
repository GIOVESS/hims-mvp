from django.contrib import admin
from .models import TriageRecord, TriageNote

@admin.register(TriageRecord)
class TriageRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'triage_level', 'nurse', 'triage_time')
    list_filter = ('triage_level', 'triage_time')
    search_fields = ('patient__first_name', 'patient__last_name')

@admin.register(TriageNote)
class TriageNoteAdmin(admin.ModelAdmin):
    list_display = ('triage_record', 'created_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('triage_record__patient__first_name', 'triage_record__patient__last_name')
