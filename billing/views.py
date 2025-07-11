from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Service, Invoice, InvoiceItem, Payment, InsuranceClaim
from .serializers import (
    ServiceSerializer, InvoiceSerializer, InvoiceItemSerializer, 
    PaymentSerializer, InsuranceClaimSerializer
)
from notifications.utils import send_notification
from django.db.models import Sum
from django.utils import timezone

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['service_type', 'is_active', 'is_taxable']
    search_fields = ['name', 'code', 'description']

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'patient']
    search_fields = ['invoice_number']
    
    def create(self, request, *args, **kwargs):
        # Generate invoice number
        import datetime
        from django.utils.crypto import get_random_string
        
        date_prefix = datetime.datetime.now().strftime('%Y%m%d')
        random_suffix = get_random_string(length=6, allowed_chars='0123456789')
        invoice_number = f"INV-{date_prefix}-{random_suffix}"
        
        request.data['invoice_number'] = invoice_number
        request.data['created_by'] = request.user.id
        
        # Calculate balance
        total_amount = request.data.get('total_amount', 0)
        request.data['balance'] = total_amount
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        invoice = self.get_object()
        
        if invoice.status != 'draft':
            return Response({'error': 'Cannot add items to invoices that are not in draft status'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        serializer = InvoiceItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(invoice=invoice)
            
            # Recalculate invoice totals
            items = InvoiceItem.objects.filter(invoice=invoice)
            total_amount = items.aggregate(total=Sum('total_amount'))['total'] or 0
            tax_amount = items.aggregate(total=Sum('tax_amount'))['total'] or 0
            
            invoice.amount = total_amount - tax_amount
            invoice.tax_amount = tax_amount
            invoice.total_amount = total_amount
            invoice.balance = total_amount - invoice.amount_paid
            invoice.save()
            
            invoice_serializer = self.get_serializer(invoice)
            return Response(invoice_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def finalize(self, request, pk=None):
        invoice = self.get_object()
        
        if invoice.status != 'draft':
            return Response({'error': 'Invoice is already finalized'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        invoice.status = 'pending'
        invoice.save()
        
        # Notify patient if they have an email
        if invoice.patient.email:
            # Logic to send email notification to patient
            pass
        
        # Notify the department that created the invoice
        send_notification(
            recipient_type='user',
            recipient_id=invoice.created_by.id,
            notification_type='info',
            title='Invoice Finalized',
            message=f'Invoice {invoice.invoice_number} for {invoice.patient.first_name} {invoice.patient.last_name} has been finalized.',
            data={'invoice_id': invoice.id},
            sender=request.user
        )
        
        serializer = self.get_serializer(invoice)
        return Response(serializer.data)

class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['invoice', 'service']
    
    def perform_destroy(self, instance):
        invoice = instance.invoice
        
        # Ensure invoice is in draft status
        if invoice.status != 'draft':
            raise serializers.ValidationError("Cannot modify items for invoices that are not in draft status")
        
        instance.delete()
        
        # Recalculate invoice totals
        items = InvoiceItem.objects.filter(invoice=invoice)
        total_amount = items.aggregate(total=Sum('total_amount'))['total'] or 0
        tax_amount = items.aggregate(total=Sum('tax_amount'))['total'] or 0
        
        invoice.amount = total_amount - tax_amount
        invoice.tax_amount = tax_amount
        invoice.total_amount = total_amount
        invoice.balance = total_amount - invoice.amount_paid
        invoice.save()

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['invoice', 'payment_method']
    
    def create(self, request, *args, **kwargs):
        invoice_id = request.data.get('invoice')
        
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            
            # Ensure invoice is in appropriate status
            if invoice.status not in ['pending', 'partial']:
                return Response({'error': 'Payments can only be made for pending or partially paid invoices'}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Set received_by to current user
            request.data['received_by'] = request.user.id
            
            # Create payment
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            # Update invoice amount_paid and balance
            payment_amount = serializer.validated_data['amount']
            invoice.amount_paid += payment_amount
            invoice.balance -= payment_amount
            
            # Update invoice status
            if invoice.balance <= 0:
                invoice.status = 'paid'
            else:
                invoice.status = 'partial'
                
            invoice.save()
            
            # Notify billing department
            send_notification(
                recipient_type='department',
                recipient_id='billing',
                notification_type='success',
                title='Payment Received',
                message=f'Payment of ${payment_amount} received for Invoice {invoice.invoice_number}',
                data={'invoice_id': invoice.id, 'payment_id': serializer.instance.id},
                sender=request.user
            )
            
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)

class InsuranceClaimViewSet(viewsets.ModelViewSet):
    queryset = InsuranceClaim.objects.all()
    serializer_class = InsuranceClaimSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'insurance_provider']
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        claim = self.get_object()
        
        if claim.status != 'pending':
            return Response({'error': 'Claim is not in pending status'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        claim.status = 'submitted'
        claim.submission_date = timezone.now().date()
        claim.save()
        
        serializer = self.get_serializer(claim)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def process_approval(self, request, pk=None):
        claim = self.get_object()
        
        if claim.status not in ['submitted', 'in_review']:
            return Response({'error': 'Claim must be submitted or in review status'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        amount_approved = request.data.get('amount_approved')
        
        if not amount_approved:
            return Response({'error': 'Approved amount is required'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        amount_approved = float(amount_approved)
        
        # Check if fully or partially approved
        if amount_approved >= claim.amount_claimed:
            claim.status = 'approved'
        else:
            claim.status = 'partially_approved'
        
        claim.amount_approved = amount_approved
        claim.approval_date = timezone.now().date()
        claim.save()
        
        # Update invoice if insurance payment is automatic
        invoice = claim.invoice
        if request.data.get('apply_payment', False):
            # Create payment record
            Payment.objects.create(
                invoice=invoice,
                amount=amount_approved,
                payment_method='insurance',
                reference_number=claim.claim_number,
                received_by=request.user,
                notes=f"Insurance payment for claim {claim.claim_number}"
            )
            
            # Update invoice
            invoice.amount_paid += amount_approved
            invoice.balance -= amount_approved
            
            if invoice.balance <= 0:
                invoice.status = 'paid'
            else:
                invoice.status = 'partial'
                
            invoice.save()
        
        serializer = self.get_serializer(claim)
        return Response(serializer.data)
