from django.urls import path

from .views import RoomView, TokenView

urlpatterns = [
    path("rooms", RoomView.as_view(), name="room_list"),
    path("token/<username>", TokenView.as_view(), name="rooms"),
]



