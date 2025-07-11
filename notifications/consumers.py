import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.user_group_name = f"notifications_{self.user.id}"
        
        # Join user group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave user group
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )
    
    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', '')
        
        if message_type == 'mark_read':
            notification_id = data.get('notification_id')
            await self.mark_notification_as_read(notification_id)
            
            # Send acknowledgment back to client
            await self.send(text_data=json.dumps({
                'type': 'notification_marked_read',
                'notification_id': notification_id
            }))
    
    # Receive message from group
    async def notification_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))
    
    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        from .models import Notification
        try:
            notification = Notification.objects.get(id=notification_id, user=self.user)
            notification.is_read = True
            notification.save()
            return True
        except Notification.DoesNotExist:
            return False
