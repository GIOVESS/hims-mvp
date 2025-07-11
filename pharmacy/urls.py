from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MedicationViewSet, MedicationDispenseViewSet, 
    InventoryViewSet, MedicationTransactionViewSet
)

router = DefaultRouter()
router.register(r'medications', MedicationViewSet)
router.register(r'dispenses', MedicationDispenseViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'transactions', MedicationTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
