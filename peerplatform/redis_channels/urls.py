from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *

urlpatterns = [
    path("", subscriptions_to_redis_channel, name="subscriptions")
]

urlpatterns = format_suffix_patterns(urlpatterns)



