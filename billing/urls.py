from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet, InvoiceViewSet, InvoiceItemViewSet, 
    PaymentViewSet, InsuranceClaimViewSet
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'invoice-items', InvoiceItemViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'insurance-claims', InsuranceClaimViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
