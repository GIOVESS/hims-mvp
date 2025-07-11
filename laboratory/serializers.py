from rest_framework import serializers
from .models import LabTest, LabResult, Sample
from reception.serializers import PatientSerializer

class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = '__all__'

class LabResultSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    test_name = serializers.SerializerMethodField()
    technician_name = serializers.SerializerMethodField()
    
    class Meta:
        model = LabResult
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    
    def get_test_name(self, obj):
        return obj.test.name
    
    def get_technician_name(self, obj):
        return obj.technician.get_full_name()

class SampleSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    collected_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Sample
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.lab_request.consultation.patient.first_name} {obj.lab_request.consultation.patient.last_name}"
    
    def get_collected_by_name(self, obj):
        return obj.collected_by.get_full_name()
