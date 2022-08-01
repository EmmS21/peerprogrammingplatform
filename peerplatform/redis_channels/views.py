from django.shortcuts import render
from django.conf import settings
import redis
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import time

redis_channel = redis.StrictRedis(
    host='localhost',
    port=6379
)
# Create your views here.
@api_view(['GET', 'POST'])
def subscriptions_to_redis_channel(request, *args, **kwargs):
    if request.method == 'GET':
        subs = {}
        count = 0
        for key in redis_channel.keys("*"):
            print('getting from redis', key.decode("utf-8"))
            subs[key.decode("utf-8")] = redis_channel.get(key)
            count += 1
        response = {
            'count': f"Found: {count}, subscriptions.",
            'subscriptions': subs
        }
        return Response(response, status=200)
    elif request.method == 'POST':
        subscriptions = request.body
        print('subs', subscriptions)
        key = time.time()
        # key = list(subscriptions.keys())[0]
        value = subscriptions
        redis_channel.set(key, value)
        response = {
            'msg': f"{key} successfully set to {value}"
        }
        return Response(response, 201)

