from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Patient, Appointment, Queue
from .serializers import PatientSerializer, AppointmentSerializer, QueueSerializer
import datetime

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['gender', 'blood_type']
    search_fields = ['first_name', 'last_name', 'phone_number', 'email']
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            patients = Patient.objects.filter(
                models.Q(first_name__icontains=query) | 
                models.Q(last_name__icontains=query) | 
                models.Q(phone_number__icontains=query) | 
                models.Q(email__icontains=query)
            )
            serializer = self.get_serializer(patients, many=True)
            return Response(serializer.data)
        return Response({'error': 'Search query required'}, status=status.HTTP_400_BAD_REQUEST)

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['scheduled_date', 'status', 'doctor', 'patient']
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        today = datetime.date.today()
        appointments = Appointment.objects.filter(scheduled_date=today)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_doctor(self, request):
        doctor_id = request.query_params.get('doctor_id', None)
        if doctor_id:
            appointments = Appointment.objects.filter(doctor_id=doctor_id)
            serializer = self.get_serializer(appointments, many=True)
            return Response(serializer.data)
        return Response({'error': 'Doctor ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_patient(self, request):
        patient_id = request.query_params.get('patient_id', None)
        if patient_id:
            appointments = Appointment.objects.filter(patient_id=patient_id)
            serializer = self.get_serializer(appointments, many=True)
            return Response(serializer.data)
        return Response({'error': 'Patient ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        appointment = self.get_object()
        if appointment.status == 'scheduled':
            appointment.status = 'checked_in'
            appointment.save()
            
            # Add to appropriate queue
            Queue.objects.create(
                patient=appointment.patient,
                appointment=appointment,
                department=appointment.doctor.department or 'general',
                priority='normal'
            )
            
            serializer = self.get_serializer(appointment)
            return Response(serializer.data)
        return Response({'error': 'Appointment is not in scheduled status'}, status=status.HTTP_400_BAD_REQUEST)

class QueueViewSet(viewsets.ModelViewSet):
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['department', 'priority', 'status']
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        department = request.query_params.get('department', None)
        if department:
            queue_entries = Queue.objects.filter(
                department=department,
                status='waiting'
            ).order_by('priority', 'check_in_time')
            serializer = self.get_serializer(queue_entries, many=True)
            return Response(serializer.data)
        return Response({'error': 'Department parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def update_priority(self, request, pk=None):
        queue_entry = self.get_object()
        priority = request.data.get('priority', None)
        if priority in [choice[0] for choice in Queue.PRIORITY_CHOICES]:
            queue_entry.priority = priority
            queue_entry.save()
            serializer = self.get_serializer(queue_entry)
            return Response(serializer.data)
        return Response({'error': 'Invalid priority value'}, status=status.HTTP_400_BAD_REQUEST)
