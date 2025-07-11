from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

from .models import Notification, NotificationSetting
from .serializers import NotificationSerializer, NotificationSettingSerializer

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Filter by read status if specified
        read_status = request.query_params.get('read')
        if read_status:
            is_read = read_status.lower() == 'true'
            notifications = Notification.objects.filter(user=request.user, is_read=is_read)
        else:
            notifications = Notification.objects.filter(user=request.user)
        
        # Limit to recent notifications
        notifications = notifications.order_by('-created_at')[:50]
        
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Mark notifications as read"""
        notification_ids = request.data.get('notification_ids', [])
        
        if not notification_ids:
            return Response(
                {"error": "No notification IDs provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update notifications
        count = Notification.objects.filter(
            id__in=notification_ids, 
            user=request.user
        ).update(is_read=True)
        
        return Response({"marked_read": count})

class NotificationSettingsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        settings, created = NotificationSetting.objects.get_or_create(user=request.user)
        serializer = NotificationSettingSerializer(settings)
        return Response(serializer.data)
    
    def put(self, request):
        settings, created = NotificationSetting.objects.get_or_create(user=request.user)
        serializer = NotificationSettingSerializer(settings, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def send_notification(user, title, description, notification_type='info', related_object=None):
    """
    Helper function to send a notification to a user
    
    Args:
        user: User object
        title: Notification title
        description: Notification description
        notification_type: Type of notification (info, success, alert, error)
        related_object: Optional related object (for linking)
    
    Returns:
        Notification object
    """
    # Create notification in database
    notification = Notification.objects.create(
        user=user,
        title=title,
        description=description,
        notification_type=notification_type
    )
    
    # If there's a related object, link it
    if related_object:
        from django.contrib.contenttypes.models import ContentType
        content_type = ContentType.objects.get_for_model(related_object)
        notification.content_type = content_type
        notification.object_id = related_object.id
        notification.save()
    
    # Send real-time notification via WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_{user.id}",
        {
            'type': 'notification_message',
            'message': {
                'id': notification.id,
                'title': notification.title,
                'description': notification.description,
                'type': notification.notification_type,
                'created_at': notification.created_at.isoformat(),
                'is_read': notification.is_read
            }
        }
    )
    
    return notification
