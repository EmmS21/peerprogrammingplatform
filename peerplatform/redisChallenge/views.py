import json
from django.conf import settings
import redis
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
import re
from django.core.cache import caches
from django.views.decorators.csrf import csrf_exempt

# redis_instance = caches["default"]
# elasticache_redis_instance = caches["leadership_board"]
redis_instance = redis.StrictRedis(host=settings.REDIS_HOST,
                                   port=settings.REDIS_PORT,
                                   password =settings.REDIS_PASSWORD)

@api_view(['GET', 'POST'])
def programming_challenge(request, *args, **kwargs):
    if request.method == 'GET':
        print('request contains', request)
        print('request body', request.body)
        print('args',args)
        argument = json.loads(request.body.decode("utf-8"))
        items = []
        challenge_received = redis_instance.smembers(argument["room"])
        response = {
            'elements': json.loads(challenge_received)
        }
        # redis_instance.delete('challenge')
        return Response(response, status=200)
    elif request.method == 'POST':
        programmingChallengeReceived = json.loads(request.body.decode("utf-8"))
        redis_instance.delete(programmingChallengeReceived["room"])
        key = programmingChallengeReceived["room"]
        del programmingChallengeReceived["room"]
        redis_instance.sadd(key, str(programmingChallengeReceived["challenge"]))
        response = {
            'msg': f'set contains: {programmingChallengeReceived}'
        }
        return Response(response, 201)