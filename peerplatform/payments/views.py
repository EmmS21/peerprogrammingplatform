import stripe
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from decouple import config

stripe.api_key = config('STRIPE_SECRET_KEY')

@api_view(['POST'])
def test_payment(request):
    test_payment_intent = stripe.PaymentIntent.create(
        amount=1500,
        currency='usd',
        payment_method_types=['card'],
        receipt_email='emmanuelsibanda21@gmail.com'
    )
    return Response(status=status.HTTP_200_OK,
                    data=test_payment_intent)


