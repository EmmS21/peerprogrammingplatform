from django.urls import path

from .views import get_help, receive_response, get_answer

urlpatterns = [
    path("get", get_help, name="get_help"),
    path("post", receive_response, name="post"),
    path("answer", get_answer, name="get_answer"),
]
