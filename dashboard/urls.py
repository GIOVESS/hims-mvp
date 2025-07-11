from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('patient-queue/', views.PatientQueueView.as_view(), name='patient-queue'),
    path('bed-occupancy/', views.BedOccupancyView.as_view(), name='bed-occupancy'),
    path('revenue-chart/', views.RevenueChartView.as_view(), name='revenue-chart'),
    path('recent-activity/', views.RecentActivityView.as_view(), name='recent-activity'),
]
