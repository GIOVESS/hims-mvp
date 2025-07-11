from rest_framework import serializers
from .models import Consultation, Prescription, LabRequest, ConsultationNote
from reception.serializers import PatientSerializer
from accounts.serializers import DoctorSerializer

class PrescriptionSerializer(serializers.ModelSerializer):
    prescribed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Prescription
        fields = '__all__'
    
    def get_prescribed_by_name(self, obj):
        return f"Dr. {obj.prescribed_by.user.first_name} {obj.prescribed_by.user.last_name}"

class LabRequestSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = LabRequest
        fields = '__all__'
    
    def get_requested_by_name(self, obj):
        return f"Dr. {obj.requested_by.user.first_name} {obj.requested_by.user.last_name}"

class ConsultationNoteSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ConsultationNote
        fields = '__all__'
    
    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name()

class ConsultationSerializer(serializers.ModelSerializer):
    patient_details = serializers.SerializerMethodField()
    doctor_details = serializers.SerializerMethodField()
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    lab_requests = LabRequestSerializer(many=True, read_only=True)
    notes = ConsultationNoteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Consultation
        fields = '__all__'
    
    def get_patient_details(self, obj):
        return {
            'id': obj.patient.id,
            'name': f"{obj.patient.first_name} {obj.patient.last_name}",
            'age': obj.patient.age(),
            'gender': obj.patient.get_gender_display()
        }
    
    def get_doctor_details(self, obj):
        return {
            'id': obj.doctor.id,
            'name': f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}",
            'specialty': obj.doctor.get_specialty_display()
        }
