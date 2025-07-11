from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Ward, Bed, WardStay, VitalSign, NursingTask
from .serializers import WardSerializer, BedSerializer, WardStaySerializer, VitalSignSerializer, NursingTaskSerializer
from django.utils import timezone
from notifications.utils import send_notification

class WardViewSet(viewsets.ModelViewSet):
    queryset = Ward.objects.all()
    serializer_class = WardSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ward_type', 'is_active']
    
    @action(detail=True, methods=['get'])
    def beds(self, request, pk=None):
        ward = self.get_object()
        beds = Bed.objects.filter(ward=ward)
        serializer = BedSerializer(beds, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def occupancy(self, request, pk=None):
        ward = self.get_object()
        total_beds = ward.beds.count()
        occupied_beds = ward.beds.filter(status='occupied').count()
        available_beds = ward.beds.filter(status='available').count()
        
        occupancy_rate = (occupied_beds / total_beds * 100) if total_beds > 0 else 0
        
        return Response({
            'total_beds': total_beds,
            'occupied_beds': occupied_beds,
            'available_beds': available_beds,
            'occupancy_rate': f"{occupancy_rate:.1f}%"
        })

class BedViewSet(viewsets.ModelViewSet):
    queryset = Bed.objects.all()
    serializer_class = BedSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ward', 'status', 'bed_type']
    
    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        bed = self.get_object()
        status = request.data.get('status', None)
        
        if status in [choice[0] for choice in Bed.BED_STATUS]:
            # If changing to occupied, need to check if there's an active stay
            if status == 'occupied' and bed.status != 'occupied':
                active_stay = WardStay.objects.filter(bed=bed, is_active=True).exists()
                if not active_stay:
                    return Response({'error': 'Cannot mark bed as occupied without an active ward stay'}, 
                                   status=status.HTTP_400_BAD_REQUEST)
            
            # If changing from occupied to available, need to check if there's an active stay
            if bed.status == 'occupied' and status == 'available':
                active_stay = WardStay.objects.filter(bed=bed, is_active=True).exists()
                if active_stay:
                    return Response({'error': 'Cannot mark bed as available while there is an active ward stay'}, 
                                   status=status.HTTP_400_BAD_REQUEST)
            
            bed.status = status
            bed.save()
            serializer = self.get_serializer(bed)
            return Response(serializer.data)
        
        return Response({'error': 'Invalid status value'}, status=status.HTTP_400_BAD_REQUEST)

class WardStayViewSet(viewsets.ModelViewSet):
    queryset = WardStay.objects.all()
    serializer_class = WardStaySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active', 'bed__ward', 'admission_type']
    
    def create(self, request, *args, **kwargs):
        # Check if bed is available
        bed_id = request.data.get('bed')
        try:
            bed = Bed.objects.get(id=bed_id)
            if bed.status != 'available':
                return Response({'error': 'Selected bed is not available'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Create ward stay
            response = super().create(request, *args, **kwargs)
            
            # Update bed status
            bed.status = 'occupied'
            bed.save()
            
            return response
            
        except Bed.DoesNotExist:
            return Response({'error': 'Bed not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def discharge(self, request, pk=None):
        ward_stay = self.get_object()
        
        if not ward_stay.is_active:
            return Response({'error': 'Patient is already discharged'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        doctor_id = request.data.get('discharged_by')
        discharge_diagnosis = request.data.get('discharge_diagnosis')
        discharge_instructions = request.data.get('discharge_instructions')
        
        if not (doctor_id and discharge_diagnosis):
            return Response({'error': 'Doctor ID and discharge diagnosis are required'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Update ward stay
        from accounts.models import Doctor
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            
            ward_stay.discharged_by = doctor
            ward_stay.discharge_date = timezone.now()
            ward_stay.discharge_diagnosis = discharge_diagnosis
            ward_stay.discharge_instructions = discharge_instructions
            ward_stay.is_active = False
            ward_stay.save()
            
            # Update bed status
            bed = ward_stay.bed
            bed.status = 'available'
            bed.save()
            
            # Notify billing department
            send_notification(
                recipient_type='department',
                recipient_id='billing',
                notification_type='info',
                title='Patient Discharged',
                message=f'Patient {ward_stay.patient.first_name} {ward_stay.patient.last_name} has been discharged. Please prepare final billing.',
                data={'patient_id': ward_stay.patient.id, 'ward_stay_id': ward_stay.id},
                sender=request.user
            )
            
            serializer = self.get_serializer(ward_stay)
            return Response(serializer.data)
            
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

class VitalSignViewSet(viewsets.ModelViewSet):
    queryset = VitalSign.objects.all()
    serializer_class = VitalSignSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ward_stay']
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        ward_stay_id = request.query_params.get('ward_stay', None)
        if not ward_stay_id:
            return Response({'error': 'Ward stay ID is required'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        try:
            ward_stay = WardStay.objects.get(id=ward_stay_id)
            latest_vitals = VitalSign.objects.filter(ward_stay=ward_stay).order_by('-recorded_at').first()
            
            if latest_vitals:
                serializer = self.get_serializer(latest_vitals)
                return Response(serializer.data)
            
            return Response({'error': 'No vital signs recorded for this patient stay'}, 
                           status=status.HTTP_404_NOT_FOUND)
            
        except WardStay.DoesNotExist:
            return Response({'error': 'Ward stay not found'}, status=status.HTTP_404_NOT_FOUND)

class NursingTaskViewSet(viewsets.ModelViewSet):
    queryset = NursingTask.objects.all()
    serializer_class = NursingTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ward_stay', 'status', 'assigned_to']
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        
        if task.status != 'in_progress' and task.status != 'scheduled':
            return Response({'error': 'Task cannot be completed from its current status'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        task.status = 'completed'
        task.completed_at = timezone.now()
        task.completed_by = request.user
        task.save()
        
        serializer = self.get_serializer(task)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        user = request.user
        tasks = NursingTask.objects.filter(
            assigned_to=user,
            status='scheduled',
            scheduled_time__gte=timezone.now()
        ).order_by('scheduled_time')
        
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
