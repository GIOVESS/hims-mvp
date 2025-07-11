from rest_framework import serializers
from .models import Ward, Bed, WardStay, VitalSign, NursingTask

class WardSerializer(serializers.ModelSerializer):
    available_beds = serializers.IntegerField(read_only=True)
    occupancy_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Ward
        fields = '__all__'

class BedSerializer(serializers.ModelSerializer):
    ward_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Bed
        fields = '__all__'
    
    def get_ward_name(self, obj):
        return obj.ward.name

class WardStaySerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    bed_info = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    stay_duration = serializers.SerializerMethodField()
    
    class Meta:
        model = WardStay
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    
    def get_bed_info(self, obj):
        return f"Bed {obj.bed.bed_number} in {obj.bed.ward.name}"
    
    def get_doctor_name(self, obj):
        return f"Dr. {obj.admitting_doctor.user.first_name} {obj.admitting_doctor.user.last_name}"
    
    def get_stay_duration(self, obj):
        from django.utils import timezone
        
        end_date = obj.discharge_date if obj.discharge_date else timezone.now()
        duration = end_date - obj.admission_date
        return duration.days

class VitalSignSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    recorded_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = VitalSign
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.ward_stay.patient.first_name} {obj.ward_stay.patient.last_name}"
    
    def get_recorded_by_name(self, obj):
        return obj.recorded_by.get_full_name()

class NursingTaskSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()
    completed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = NursingTask
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.ward_stay.patient.first_name} {obj.ward_stay.patient.last_name}"
    
    def get_assigned_to_name(self, obj):
        return obj.assigned_to.get_full_name()
    
    def get_completed_by_name(self, obj):
        if obj.completed_by:
            return obj.completed_by.get_full_name()
        return None
