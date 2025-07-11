from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Department, Doctor

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'user_type', 'phone_number', 'profile_picture', 
                  'department', 'employee_id']
        read_only_fields = ['id']

class DepartmentSerializer(serializers.ModelSerializer):
    head_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'head', 'head_name']
    
    def get_head_name(self, obj):
        if obj.head:
            return obj.head.get_full_name()
        return None

class DoctorSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Doctor
        fields = ['id', 'specialty', 'license_number', 'years_of_experience', 'user_details']
