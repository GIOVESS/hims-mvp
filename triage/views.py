from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import TriageRecord, TriageNote
from .serializers import TriageRecordSerializer, TriageNoteSerializer
from reception.models import Queue
from notifications.utils import send_notification

class TriageRecordViewSet(viewsets.ModelViewSet):
    queryset = TriageRecord.objects.all()
    serializer_class = TriageRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['patient', 'triage_level', 'nurse']
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        triage_record = self.get_object()
        note_text = request.data.get('note', '')
        
        if note_text:
            note = TriageNote.objects.create(
                triage_record=triage_record,
                created_by=request.user,
                note=note_text
            )
            serializer = TriageNoteSerializer(note)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'error': 'Note text is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def complete_triage(self, request, pk=None):
        triage_record = self.get_object()
        queue_entry = triage_record.queue_entry
        
        # Update triage based on the level
        if triage_record.triage_level <= 2:  # Emergency or Resuscitation
            queue_entry.priority = 'emergency'
        elif triage_record.triage_level == 3:  # Urgent
            queue_entry.priority = 'urgent'
        else:
            queue_entry.priority = 'normal'
            
        queue_entry.save()
        
        # Send notification to appropriate department based on triage level
        department = "emergency" if triage_record.triage_level <= 2 else queue_entry.department
        message = f"Patient {triage_record.patient.first_name} {triage_record.patient.last_name} triaged as level {triage_record.triage_level} - priority {queue_entry.priority}"
        
        send_notification(
            recipient_type='department',
            recipient_id=department,
            notification_type='triage_complete',
            message=message,
            data={
                'patient_id': triage_record.patient.id,
                'triage_id': triage_record.id,
                'priority': queue_entry.priority
            }
        )
        
        return Response({'status': 'Triage completed and queue updated'})

class TriageNoteViewSet(viewsets.ModelViewSet):
    queryset = TriageNote.objects.all()
    serializer_class = TriageNoteSerializer
    permission_classes = [permissions.IsAuthenticated]
