from django.urls import path

from .views import retrieveEasy, retrieveMedium, retrieveHard

urlpatterns = [
    path("get_easy", retrieveEasy, name="get_easy"),
    path("get_medium", retrieveMedium, name="get_medium"),
    path("get_hard", retrieveHard, name="get_hard"),
]
