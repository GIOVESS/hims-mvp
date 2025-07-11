from rest_framework import serializers
from .models import Notification, NotificationSetting

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'description', 'notification_type', 'is_read', 'created_at']

class NotificationSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationSetting
        fields = ['email_notifications', 'sms_notifications', 'in_app_notifications']
