from rest_framework import serializers
from .models import Patient, Appointment, Queue

class PatientSerializer(serializers.ModelSerializer):
    age = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Patient
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    
    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.first_name} {obj.doctor.last_name}"

class QueueSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    wait_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Queue
        fields = '__all__'
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    
    def get_age(self, obj):
        return obj.patient.age()
    
    def get_gender(self, obj):
        return obj.patient.get_gender_display()
    
    def get_wait_time(self, obj):
        import datetime
        wait_time = datetime.datetime.now(datetime.timezone.utc) - obj.check_in_time
        minutes = int(wait_time.total_seconds() / 60)
        return f"{minutes} min"
