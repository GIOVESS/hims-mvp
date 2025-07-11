from rest_framework import serializers
from .models import Medication, MedicationDispense, Inventory, MedicationTransaction

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = '__all__'

class MedicationDispenseSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    medication_name = serializers.SerializerMethodField()
    pharmacist_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicationDispense
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    
    def get_medication_name(self, obj):
        return str(obj.medication)
    
    def get_pharmacist_name(self, obj):
        return obj.pharmacist.get_full_name()

class InventorySerializer(serializers.ModelSerializer):
    medication_name = serializers.SerializerMethodField()
    days_until_expiry = serializers.SerializerMethodField()
    
    class Meta:
        model = Inventory
        fields = '__all__'
    
    def get_medication_name(self, obj):
        return str(obj.medication)
    
    def get_days_until_expiry(self, obj):
        from django.utils import timezone
        import datetime
        
        today = timezone.now().date()
        delta = obj.expiry_date - today
        return delta.days

class MedicationTransactionSerializer(serializers.ModelSerializer):
    medication_name = serializers.SerializerMethodField()
    performed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicationTransaction
        fields = '__all__'
    
    def get_medication_name(self, obj):
        return str(obj.medication)
    
    def get_performed_by_name(self, obj):
        return obj.performed_by.get_full_name()
