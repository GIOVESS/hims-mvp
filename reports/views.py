from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg, F, Q
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone
import datetime

from reception.models import Patient, Appointment
from accounts.models import User, Doctor
from ward.models import Bed, WardStay
from billing.models import Invoice, Payment
from laboratory.models import LabResult
from pharmacy.models import MedicationDispense

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def patient_statistics(request):
    """Get patient demographic and registration statistics"""
    # Total patients
    total_patients = Patient.objects.count()
    
    # Gender distribution
    gender_distribution = Patient.objects.values('gender').annotate(count=Count('id'))
    
    # Age distribution (0-18, 19-35, 36-50, 51-65, 65+)
    from django.db.models import F, ExpressionWrapper, IntegerField
    from django.utils import timezone
    
    today = timezone.now().date()
    patients = Patient.objects.annotate(
        age=ExpressionWrapper(
            (today - F('date_of_birth')) / 365.25,
            output_field=IntegerField()
        )
    )
    
    age_ranges = {
        '0-18': patients.filter(age__lte=18).count(),
        '19-35': patients.filter(age__gt=18, age__lte=35).count(),
        '36-50': patients.filter(age__gt=35, age__lte=50).count(),
        '51-65': patients.filter(age__gt=50, age__lte=65).count(),
        '65+': patients.filter(age__gt=65).count()
    }
    
    # Registration trend by month (last 12 months)
    twelve_months_ago = today - datetime.timedelta(days=365)
    registration_trend = Patient.objects.filter(
        registration_date__gte=twelve_months_ago
    ).annotate(
        month=TruncMonth('registration_date')
    ).values('month').annotate(
        count=Count('id')
    ).order_by('month')
    
    return Response({
        'total_patients': total_patients,
        'gender_distribution': gender_distribution,
        'age_distribution': age_ranges,
        'registration_trend': registration_trend
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def financial_report(request):
    """Generate financial reports"""
    # Date range parameters
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    
    if start_date_str and end_date_str:
        from datetime import datetime
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        # Default to last 30 days
        end_date = timezone.now().date()
        start_date = end_date - datetime.timedelta(days=30)
    
    # Total revenue in period
    revenue = Payment.objects.filter(
        payment_date__date__gte=start_date,
        payment_date__date__lte=end_date
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    # Revenue by payment method
    revenue_by_method = Payment.objects.filter(
        payment_date__date__gte=start_date,
        payment_date__date__lte=end_date
    ).values('payment_method').annotate(
        total=Sum('amount')
    ).order_by('-total')
    
    # Revenue by day
    revenue_by_day = Payment.objects.filter(
        payment_date__date__gte=start_date,
        payment_date__date__lte=end_date
    ).annotate(
        day=TruncDate('payment_date')
    ).values('day').annotate(
        total=Sum('amount')
    ).order_by('day')
    
    # Outstanding invoices
    outstanding_invoices = Invoice.objects.filter(
        status__in=['pending', 'partial']
    ).aggregate(total=Sum('balance'))['total'] or 0
    
    # Revenue by service type
    from billing.models import InvoiceItem, Service
    
    revenue_by_service = InvoiceItem.objects.filter(
        invoice__date__gte=start_date,
        invoice__date__lte=end_date,
        invoice__status='paid'
    ).values(
        service_type=F('service__service_type')
    ).annotate(
        total=Sum('total_amount')
    ).order_by('-total')
    
    return Response({
        'period': {
            'start_date': start_date,
            'end_date': end_date
        },
        'total_revenue': revenue,
        'revenue_by_payment_method': revenue_by_method,
        'revenue_by_day': revenue_by_day,
        'outstanding_invoices': outstanding_invoices,
        'revenue_by_service_type': revenue_by_service
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def operational_report(request):
    """Generate operational reports"""
    # Date range parameters
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    
    if start_date_str and end_date_str:
        from datetime import datetime
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        # Default to last 30 days
        end_date = timezone.now().date()
        start_date = end_date - datetime.timedelta(days=30)
    
    # Appointment statistics
    total_appointments = Appointment.objects.filter(
        scheduled_date__gte=start_date,
        scheduled_date__lte=end_date
    ).count()
    
    appointment_status = Appointment.objects.filter(
        scheduled_date__gte=start_date,
        scheduled_date__lte=end_date
    ).values('status').annotate(
        count=Count('id')
    )
    
    # Bed occupancy statistics
    from ward.models import Ward
    
    ward_occupancy = Ward.objects.values(
        'name', 'capacity'
    ).annotate(
        occupied=Count('beds', filter=Q(beds__status='occupied'))
    ).annotate(
        occupancy_rate=F('occupied') * 100.0 / F('capacity')
    )
    
    # Average length of stay
    completed_stays = WardStay.objects.filter(
        discharge_date__isnull=False,
        admission_date__date__gte=start_date,
        discharge_date__date__lte=end_date
    )
    
    avg_stay_duration = completed_stays.annotate(
        duration=F('discharge_date') - F('admission_date')
    ).aggregate(
        avg_duration=Avg('duration')
    )['avg_duration']
    
    avg_stay_hours = avg_stay_duration.total_seconds() / 3600 if avg_stay_duration else 0
    
    # Lab test statistics
    lab_tests_by_status = LabResult.objects.filter(
        date_time__date__gte=start_date,
        date_time__date__lte=end_date
    ).values('status').annotate(
        count=Count('id')
    )
    
    # Medication dispensing statistics
    medications_dispensed = MedicationDispense.objects.filter(
        dispensed_at__date__gte=start_date,
        dispensed_at__date__lte=end_date,
        status='dispensed'
    ).count()
    
    return Response({
        'period': {
            'start_date': start_date,
            'end_date': end_date
        },
        'appointments': {
            'total': total_appointments,
            'by_status': appointment_status
        },
        'ward_occupancy': ward_occupancy,
        'average_stay_duration_hours': avg_stay_hours,
        'lab_tests': lab_tests_by_status,
        'medications_dispensed': medications_dispensed
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def doctor_performance_report(request):
    """Generate doctor performance report"""
    # Get doctor ID from request
    doctor_id = request.query_params.get('doctor_id')
    if not doctor_id:
        return Response({'error': 'Doctor ID is required'}, status=400)
    
    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor not found'}, status=404)
    
    # Date range parameters
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    
    if start_date_str and end_date_str:
        from datetime import datetime
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    else:
        # Default to last 30 days
        end_date = timezone.now().date()
        start_date = end_date - datetime.timedelta(days=30)
    
    # Appointment statistics
    appointments = Appointment.objects.filter(
        doctor=doctor.user,
        scheduled_date__gte=start_date,
        scheduled_date__lte=end_date
    )
    
    total_appointments = appointments.count()
    completed_appointments = appointments.filter(status='completed').count()
    completion_rate = (completed_appointments / total_appointments * 100) if total_appointments > 0 else 0
    
    appointments_by_day = appointments.annotate(
        day=TruncDate('scheduled_date')
    ).values('day').annotate(
        count=Count('id')
    ).order_by('day')
    
    # Revenue generated
    from billing.models import InvoiceItem
    
    revenue_generated = InvoiceItem.objects.filter(
        invoice__date__gte=start_date,
        invoice__date__lte=end_date,
        invoice__status__in=['paid', 'partial'],
        description__icontains=f"Dr. {doctor.user.last_name}"
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    return Response({
        'doctor': {
            'id': doctor.id,
            'name': f"Dr. {doctor.user.first_name} {doctor.user.last_name}",
            'specialty': doctor.get_specialty_display()
        },
        'period': {
            'start_date': start_date,
            'end_date': end_date
        },
        'appointments': {
            'total': total_appointments,
            'completed': completed_appointments,
            'completion_rate': f"{completion_rate:.1f}%",
            'by_day': appointments_by_day
        },
        'revenue_generated': revenue_generated
    })
