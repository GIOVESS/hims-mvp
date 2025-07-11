from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from .models import Notification, DepartmentNotification

User = get_user_model()

def send_notification(recipient_type, recipient_id, notification_type, title, message, data=None, sender=None):
    """
    Send a notification to a user or department
    
    Args:
        recipient_type: 'user' or 'department'
        recipient_id: User ID or department name
        notification_type: 'alert', 'info', or 'success'
        title: Notification title
        message: Notification message
        data: Optional JSON data
        sender: Optional User object who sent the notification
    """
    if data is None:
        data = {}
    
    channel_layer = get_channel_layer()
    
    if recipient_type == 'user':
        try:
            user = User.objects.get(id=recipient_id)
            
            # Save to database
            notification = Notification.objects.create(
                recipient=user,
                sender=sender,
                title=title,
                message=message,
                notification_type=notification_type,
                data=data
            )
            
            # Send via WebSocket
            notification_data = {
                'id': notification.id,
                'title': title,
                'message': message,
                'type': notification_type,
                'data': data,
                'time': notification.created_at.isoformat()
            }
            
            async_to_sync(channel_layer.group_send)(
                f"user_{user.id}",
                {
                    'type': 'notification_message',
                    'message': notification_data
                }
            )
            
        except User.DoesNotExist:
            print(f"User with ID {recipient_id} does not exist")
    
    elif recipient_type == 'department':
        # Save to database
        notification = DepartmentNotification.objects.create(
            department=recipient_id,
            sender=sender,
            title=title,
            message=message,
            notification_type=notification_type,
            data=data
        )
        
        # Send to all users in the department
        department_users = User.objects.filter(staff_profile__department=recipient_id)
        
        for user in department_users:
            # Create individual notification for each user
            user_notification = Notification.objects.create(
                recipient=user,
                sender=sender,
                title=title,
                message=message,
                notification_type=notification_type,
                data=data
            )
            
            # Send via WebSocket
            notification_data = {
                'id': user_notification.id,
                'title': title,
                'message': message,
                'type': notification_type,
                'data': data,
                'time': user_notification.created_at.isoformat()
            }
            
            async_to_sync(channel_layer.group_send)(
                f"user_{user.id}",
                {
                    'type': 'notification_message',
                    'message': notification_data
                }
            )
        
        # Also send to the department channel
        department_notification_data = {
            'id': notification.id,
            'title': title,
            'message': message,
            'type': notification_type,
            'data': data,
            'time': notification.created_at.isoformat()
        }
        
        async_to_sync(channel_layer.group_send)(
            f"department_{recipient_id}",
            {
                'type': 'notification_message',
                'message': department_notification_data
            }
        )
