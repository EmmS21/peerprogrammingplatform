from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('connect/testing/', consumers.PracticeConsumer.as_asgi()),
]
