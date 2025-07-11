from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import LabTest, LabResult, Sample
from .serializers import LabTestSerializer, LabResultSerializer, SampleSerializer
from consultation.models import LabRequest
from notifications.utils import send_notification

class LabTestViewSet(viewsets.ModelViewSet):
    queryset = LabTest.objects.all()
    serializer_class = LabTestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_active']

class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['patient', 'test', 'status']
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        lab_result = self.get_object()
        
        if lab_result.status == 'completed':
            from django.utils import timezone
            
            lab_result.verified_by = request.user
            lab_result.verified_at = timezone.now()
            lab_result.status = 'verified'
            lab_result.save()
            
            # Notify the requesting doctor
            send_notification(
                recipient_type='user',
                recipient_id=lab_result.request.requested_by.user.id,
                notification_type='info',
                title='Lab Result Verified',
                message=f'Lab result for {lab_result.patient.first_name} {lab_result.patient.last_name} has been verified.',
                data={'result_id': lab_result.id},
                sender=request.user
            )
            
            serializer = self.get_serializer(lab_result)
            return Response(serializer.data)
        
        return Response({'error': 'Lab result must be completed before it can be verified'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def deliver(self, request, pk=None):
        lab_result = self.get_object()
        
        if lab_result.status == 'verified':
            lab_result.status = 'delivered'
            lab_result.save()
            
            # Notify the patient if they have an email
            if lab_result.patient.email:
                # Logic to send email notification to patient
                pass
            
            serializer = self.get_serializer(lab_result)
            return Response(serializer.data)
        
        return Response({'error': 'Lab result must be verified before it can be delivered'}, 
                        status=status.HTTP_400_BAD_REQUEST)

class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    
    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        sample = self.get_object()
        
        if sample.status == 'collected':
            from django.utils import timezone
            
            sample.received_by = request.user
            sample.received_at = timezone.now()
            sample.status = 'received'
            sample.save()
            
            serializer = self.get_serializer(sample)
            return Response(serializer.data)
        
        return Response({'error': 'Sample must be in collected status to be received'}, 
                        status=status.HTTP_400_BAD_REQUEST)
