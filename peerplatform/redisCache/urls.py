from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import *
# manage_items, manage_item

urlpatterns = [
    path("test", add_to_redis, name="test"),
    path("", manage_items, name="items"),
    path("paired", post_object, name="paired"),
    path("delete",manage_post_object, name="single_paired"),
    path("<slug:key>", manage_item, name="single_item"),
    path("update_score/", leadership_update, name="update_score"),
]

urlpatterns = format_suffix_patterns(urlpatterns)



