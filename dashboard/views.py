from django.db.models import Count, Sum, Avg, F, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from reception.models import Patient, Appointment
from ward.models import Ward, Bed, WardStay
from billing.models import Invoice, Payment
from accounts.models import User
from notifications.models import Notification

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get date range (default: last 30 days)
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        # Total patients
        total_patients = Patient.objects.count()
        new_patients = Patient.objects.filter(registration_date__gte=start_date).count()
        
        # Bed occupancy
        total_beds = Bed.objects.filter(is_active=True).count()
        occupied_beds = Bed.objects.filter(is_active=True, status='occupied').count()
        occupancy_rate = (occupied_beds / total_beds * 100) if total_beds > 0 else 0
        
        # Revenue
        today = timezone.now().date()
        daily_revenue = Payment.objects.filter(
            payment_date__date=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        yesterday = today - timedelta(days=1)
        yesterday_revenue = Payment.objects.filter(
            payment_date__date=yesterday
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        revenue_change = 0
        if yesterday_revenue > 0:
            revenue_change = ((daily_revenue - yesterday_revenue) / yesterday_revenue) * 100
        
        # Active cases
        active_cases = WardStay.objects.filter(is_active=True).count()
        
        return Response({
            'total_patients': {
                'value': total_patients,
                'change': (new_patients / total_patients * 100) if total_patients > 0 else 0,
                'change_label': f"+{new_patients} from last {days} days"
            },
            'bed_occupancy': {
                'value': occupancy_rate,
                'total_beds': total_beds,
                'occupied_beds': occupied_beds,
                'change': 0,  # Would need historical data to calculate change
                'change_label': "Current occupancy rate"
            },
            'daily_revenue': {
                'value': daily_revenue,
                'change': revenue_change,
                'change_label': f"{'+' if revenue_change >= 0 else ''}{revenue_change:.1f}% from yesterday"
            },
            'active_cases': {
                'value': active_cases,
                'change': 0,  # Would need historical data to calculate change
                'change_label': "Current active cases"
            }
        })

class PatientQueueView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get patients in queue (checked in but not yet seen)
        from reception.models import Queue
        
        queued_patients = Queue.objects.filter(
            status='waiting'
        ).select_related('patient')
        
        queue_data = []
        for queue_entry in queued_patients:
            # Calculate wait time
            wait_time = timezone.now() - queue_entry.check_in_time
            wait_minutes = int(wait_time.total_seconds() / 60)
            
            queue_data.append({
                'id': queue_entry.patient.patient_id,
                'name': queue_entry.patient.get_full_name(),
                'age': queue_entry.patient.age(),
                'gender': queue_entry.patient.get_gender_display(),
                'waitTime': f"{wait_minutes} min",
                'priority': queue_entry.priority,
                'department': queue_entry.department
            })
        
        return Response(queue_data)

class BedOccupancyView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get overall occupancy data
        total_beds = Bed.objects.filter(is_active=True).count()
        occupied_beds = Bed.objects.filter(is_active=True, status='occupied').count()
        available_beds = total_beds - occupied_beds
        
        # Get ward-specific data
        wards = Ward.objects.filter(is_active=True)
        ward_data = []
        
        for ward in wards:
            ward_beds = ward.beds.filter(is_active=True)
            total = ward_beds.count()
            occupied = ward_beds.filter(status='occupied').count()
            
            ward_data.append({
                'name': ward.name,
                'total': total,
                'occupied': occupied
            })
        
        return Response({
            'overall': [
                {'name': 'Occupied', 'value': occupied_beds, 'color': '#ef4444'},
                {'name': 'Available', 'value': available_beds, 'color': '#22c55e'}
            ],
            'wards': ward_data
        })

class RevenueChartView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get revenue data for the past 7 days
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=6)
        
        # Initialize data for all 7 days
        revenue_data = []
        current_date = start_date
        
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        
        while current_date <= end_date:
            day_revenue = Payment.objects.filter(
                payment_date__date=current_date
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            revenue_data.append({
                'day': days[current_date.weekday()],
                'revenue': float(day_revenue)
            })
            
            current_date += timedelta(days=1)
        
        return Response(revenue_data)

class RecentActivityView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get recent system activities
        recent_activities = []
        
        # Recent ward stays
        ward_stays = WardStay.objects.select_related(
            'patient', 'admitting_doctor__user'
        ).order_by('-created_at')[:5]
        
        for stay in ward_stays:
            recent_activities.append({
                'id': f"stay{stay.id}",
                'user': {
                    'name': stay.admitting_doctor.user.get_full_name(),
                    'avatar': stay.admitting_doctor.user.profile_picture.url if stay.admitting_doctor.user.profile_picture else None,
                    'role': stay.admitting_doctor.user.get_user_type_display()
                },
                'action': 'admitted',
                'target': stay.patient.get_full_name(),
                'time': self._get_time_ago(stay.created_at)
            })
        
        # Recent appointments
        appointments = Appointment.objects.select_related(
            'patient', 'doctor'
        ).filter(status='completed').order_by('-updated_at')[:5]
        
        for appointment in appointments:
            recent_activities.append({
                'id': f"app{appointment.id}",
                'user': {
                    'name': appointment.doctor.get_full_name(),
                    'avatar': appointment.doctor.profile_picture.url if appointment.doctor.profile_picture else None,
                    'role': appointment.doctor.get_user_type_display()
                },
                'action': 'completed consultation with',
                'target': appointment.patient.get_full_name(),
                'time': self._get_time_ago(appointment.updated_at)
            })
        
        # Recent payments
        payments = Payment.objects.select_related(
            'invoice__patient', 'received_by'
        ).order_by('-created_at')[:5]
        
        for payment in payments:
            recent_activities.append({
                'id': f"pay{payment.id}",
                'user': {
                    'name': payment.received_by.get_full_name(),
                    'avatar': payment.received_by.profile_picture.url if payment.received_by.profile_picture else None,
                    'role': payment.received_by.get_user_type_display()
                },
                'action': 'received payment from',
                'target': payment.invoice.patient.get_full_name(),
                'time': self._get_time_ago(payment.created_at)
            })
        
        # Sort by time (most recent first) and limit to 10
        recent_activities.sort(key=lambda x: x['time'], reverse=False)
        return Response(recent_activities[:10])
    
    def _get_time_ago(self, timestamp):
        """Convert timestamp to human-readable time ago format"""
        now = timezone.now()
        diff = now - timestamp
        
        if diff.days > 0:
            return f"{diff.days} {'day' if diff.days == 1 else 'days'} ago"
        
        hours = diff.seconds // 3600
        if hours > 0:
            return f"{hours} {'hour' if hours == 1 else 'hours'} ago"
        
        minutes = diff.seconds // 60
        if minutes > 0:
            return f"{minutes} {'minute' if minutes == 1 else 'minutes'} ago"
        
        return "just now"
