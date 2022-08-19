from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *
# manage_items, manage_item

urlpatterns = [
    path("", manage_items, name="items"),
    path("paired", post_object, name="paired"),
    path("delete",manage_post_object, name="single_paired"),
    # path("/post/", postToRedis, name="postToRedis"),
    path("<slug:key>", manage_item, name="single_item"),
    # path("subscriptions", subscriptions_to_redis_channel, name="subscriptions")
]

urlpatterns = format_suffix_patterns(urlpatterns)



