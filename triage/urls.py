from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TriageRecordViewSet, TriageNoteViewSet

router = DefaultRouter()
router.register(r'records', TriageRecordViewSet)
router.register(r'notes', TriageNoteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
