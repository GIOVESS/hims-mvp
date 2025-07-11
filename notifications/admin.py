from django.contrib import admin
from .models import Notification, DepartmentNotification, NotificationSetting

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'recipient', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'recipient__first_name', 'recipient__last_name')

@admin.register(DepartmentNotification)
class DepartmentNotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'notification_type', 'created_at')
    list_filter = ('department', 'notification_type', 'created_at')
    search_fields = ('title', 'message', 'department')

@admin.register(NotificationSetting)
class NotificationSettingAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_notifications', 'sms_notifications', 'in_app_notifications')
    list_filter = ('email_notifications', 'sms_notifications', 'in_app_notifications')
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
