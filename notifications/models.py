from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User

class Notification(models.Model):
    TYPE_CHOICES = (
        ('info', 'Information'),
        ('success', 'Success'),
        ('alert', 'Alert'),
        ('error', 'Error'),
    )
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications', null=True, blank=True)
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='info')
    data = models.JSONField(default=dict, blank=True)
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.recipient.get_full_name()}"
    
    class Meta:
        ordering = ['-created_at']

class DepartmentNotification(models.Model):
    TYPE_CHOICES = (
        ('info', 'Information'),
        ('success', 'Success'),
        ('alert', 'Alert'),
        ('error', 'Error'),
    )
    
    department = models.CharField(max_length=100)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_department_notifications', null=True, blank=True)
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='info')
    data = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.department}"
    
    class Meta:
        ordering = ['-created_at']

class NotificationSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_settings')
    
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    in_app_notifications = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Notification settings for {self.user.get_full_name()}"
