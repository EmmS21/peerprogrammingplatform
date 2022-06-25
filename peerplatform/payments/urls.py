from django.urls import path
from .views import test_payment, save_stripe_info

urlpatterns = [
    path("test-payment", test_payment, name="test-payment"),
    path("save-stripe-info/", save_stripe_info, name='save_stripe_info')
]



