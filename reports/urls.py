from django.urls import path
from . import views

urlpatterns = [
    path('patient-statistics/', views.patient_statistics, name='patient-statistics'),
    path('financial-report/', views.financial_report, name='financial-report'),
    path('operational-report/', views.operational_report, name='operational-report'),
    path('doctor-performance/', views.doctor_performance_report, name='doctor-performance-report'),
]
