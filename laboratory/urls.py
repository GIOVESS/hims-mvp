from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LabTestViewSet, LabResultViewSet, SampleViewSet

router = DefaultRouter()
router.register(r'tests', LabTestViewSet)
router.register(r'results', LabResultViewSet)
router.register(r'samples', SampleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
