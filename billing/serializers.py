from rest_framework import serializers
from .models import Service, Invoice, InvoiceItem, Payment, InsuranceClaim

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class InvoiceItemSerializer(serializers.ModelSerializer):
    service_name = serializers.SerializerMethodField()
    
    class Meta:
        model = InvoiceItem
        fields = '__all__'
    
    def get_service_name(self, obj):
        return obj.service.name

class PaymentSerializer(serializers.ModelSerializer):
    received_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = '__all__'
    
    def get_received_by_name(self, obj):
        return obj.received_by.get_full_name()

class InsuranceClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceClaim
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    items = InvoiceItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    insurance_claim = InsuranceClaimSerializer(read_only=True)
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    
    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name()
