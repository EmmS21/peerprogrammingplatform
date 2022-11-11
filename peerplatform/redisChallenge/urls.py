from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *
# manage_items, manage_item

urlpatterns = [
    path("", programming_challenge, name="programming_challenge"),
]

urlpatterns = format_suffix_patterns(urlpatterns)



