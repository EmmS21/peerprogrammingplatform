from django.urls import path
from .views import test_payment

urlpatterns = [
    path("test-payment", test_payment, name="test-payment"),
]



