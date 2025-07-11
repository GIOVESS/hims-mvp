from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WardViewSet, BedViewSet, WardStayViewSet, VitalSignViewSet, NursingTaskViewSet

router = DefaultRouter()
router.register(r'wards', WardViewSet)
router.register(r'beds', BedViewSet)
router.register(r'stays', WardStayViewSet)
router.register(r'vitals', VitalSignViewSet)
router.register(r'tasks', NursingTaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
