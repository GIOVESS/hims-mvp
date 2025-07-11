from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/reception/', include('reception.urls')),
    path('api/triage/', include('triage.urls')),
    path('api/consultation/', include('consultation.urls')),
    path('api/laboratory/', include('laboratory.urls')),
    path('api/pharmacy/', include('pharmacy.urls')),
    path('api/ward/', include('ward.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/reports/', include('reports.urls')),
    
    # Serve the frontend in production
    path('', TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [path('api-auth/', include('rest_framework.urls'))]
