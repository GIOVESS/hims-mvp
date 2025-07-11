import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from notifications.middleware import TokenAuthMiddleware
import notifications.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hims_project.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddleware(
            URLRouter(
                notifications.routing.websocket_urlpatterns
            )
        )
    ),
})
