from django.urls import path

from .views import get_help, receive_response

urlpatterns = [
    path("get", get_help, name="get_help"),
    path("post", receive_response, name="post"),
]
