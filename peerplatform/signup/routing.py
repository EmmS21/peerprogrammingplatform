from django.urls import path, re_path
from . import consumers

websocket_urlpatterns = [
    path('connect/sync/', consumers.synchronizeCodeEditorStates.as_asgi()),
    path('connect/challenge_sync/', consumers.synchronizeChallenges.as_asgi()),
    # re_path('connect/testing/', consumers.PracticeConsumer.as_asgi()),
]
