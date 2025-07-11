from rest_framework import serializers
from .models import TriageRecord, TriageNote
from reception.serializers import PatientSerializer, QueueSerializer

class TriageNoteSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = TriageNote
        fields = '__all__'
    
    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name()

class TriageRecordSerializer(serializers.ModelSerializer):
    patient_details = serializers.SerializerMethodField()
    nurse_name = serializers.SerializerMethodField()
    notes = TriageNoteSerializer(many=True, read_only=True)
    
    class Meta:
        model = TriageRecord
        fields = '__all__'
    
    def get_patient_details(self, obj):
        return {
            'id': obj.patient.id,
            'name': f"{obj.patient.first_name} {obj.patient.last_name}",
            'age': obj.patient.age(),
            'gender': obj.patient.get_gender_display()
        }
    
    def get_nurse_name(self, obj):
        return obj.nurse.get_full_name()
