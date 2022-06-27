import stripe
from django.views.decorators.csrf import csrf_exempt
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


@csrf_exempt
@api_view(['POST'])
def save_stripe_info(request):
    data = request.data
    cardholder_name = data['name']
    email = data['email']
    payment_method_id = data['paymentMethod_id']

    customer = stripe.Customer.create(
        name=cardholder_name,
        email=email,
        payment_method=payment_method_id
    )
    return Response(status=status.HTTP_200_OK, data={
        'message': 'Success',
        'data': {'customer_id': customer.id}
    })
