from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Medication, MedicationDispense, Inventory, MedicationTransaction
from .serializers import (
    MedicationSerializer, MedicationDispenseSerializer, 
    InventorySerializer, MedicationTransactionSerializer
)
from consultation.models import Prescription
from notifications.utils import send_notification
from django.db.models import F

class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active', 'requires_prescription', 'is_controlled', 'dosage_form']
    search_fields = ['name', 'generic_name', 'brand_name']
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        low_stock_items = Medication.objects.filter(stock_level__lte=F('reorder_level'))
        serializer = self.get_serializer(low_stock_items, many=True)
        return Response(serializer.data)

class MedicationDispenseViewSet(viewsets.ModelViewSet):
    queryset = MedicationDispense.objects.all()
    serializer_class = MedicationDispenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'patient', 'pharmacist']
    
    @action(detail=True, methods=['post'])
    def prepare(self, request, pk=None):
        dispense = self.get_object()
        
        if dispense.status == 'pending':
            # Check if stock is available
            medication = dispense.medication
            if medication.stock_level >= dispense.quantity:
                dispense.status = 'prepared'
                dispense.save()
                
                serializer = self.get_serializer(dispense)
                return Response(serializer.data)
            else:
                return Response({'error': 'Insufficient stock available'}, 
                                status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'error': 'Dispense must be in pending status to be prepared'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def complete_dispense(self, request, pk=None):
        dispense = self.get_object()
        
        if dispense.status == 'prepared':
            # Update medication stock
            medication = dispense.medication
            medication.stock_level -= dispense.quantity
            medication.save()
            
            # Create transaction record
            MedicationTransaction.objects.create(
                medication=medication,
                transaction_type='dispensed',
                quantity=dispense.quantity,
                performed_by=request.user,
                dispense=dispense,
                notes=f"Dispensed to patient {dispense.patient.first_name} {dispense.patient.last_name}"
            )
            
            # Update prescription status
            prescription = dispense.prescription
            prescription.status = 'dispensed'
            prescription.save()
            
            # Update dispense status
            dispense.status = 'dispensed'
            dispense.save()
            
            # Send notification to the doctor
            send_notification(
                recipient_type='user',
                recipient_id=prescription.prescribed_by.user.id,
                notification_type='info',
                title='Medication Dispensed',
                message=f'Medication {medication.name} has been dispensed to {dispense.patient.first_name} {dispense.patient.last_name}',
                data={'dispense_id': dispense.id},
                sender=request.user
            )
            
            serializer = self.get_serializer(dispense)
            return Response(serializer.data)
        
        return Response({'error': 'Dispense must be in prepared status to be completed'}, 
                        status=status.HTTP_400_BAD_REQUEST)

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    
    @action(detail=False, methods=['get'])
    def expiring_soon(self, request):
        from django.utils import timezone
        import datetime
        
        days = int(request.query_params.get('days', 30))
        threshold_date = timezone.now().date() + datetime.timedelta(days=days)
        
        expiring_items = Inventory.objects.filter(expiry_date__lte=threshold_date)
        serializer = self.get_serializer(expiring_items, many=True)
        return Response(serializer.data)

class MedicationTransactionViewSet(viewsets.ModelViewSet):
    queryset = MedicationTransaction.objects.all()
    serializer_class = MedicationTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['transaction_type', 'medication']
