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
def manage_items(request, *args, **kwargs):
    if request.method == 'GET':
        items = []
        count = 0
        for elem in redis_instance.smembers("pairs"):
            # print('getting from redis', elem.decode("utf-8"))
            items.append(elem.decode("utf-8"))
            count += 1
        response = {
            'elements': items
        }
        return Response(response, status=200)
    elif request.method == 'POST':
        new_users = request.body.decode("utf-8").split(",")
        # print('users', new_users)
        for i in range(0, len(new_users)):
            # print('each iter', new_users[i])
            redis_instance.sadd('pairs', re.sub("[\"\']", "", new_users[i]).strip('[]'))
        response = {
            'msg': f'set contains: {new_users}'
        }
        return Response(response, 201)

@api_view(['GET', 'PUT', 'DELETE'])
def manage_item(request, *args, **kwargs):
    if request.method == 'GET':
        if kwargs['key']:
            value = redis_instance.get(kwargs['key'])
            if value:
                response = {
                    'key': kwargs['key'],
                    'value': value,
                    'msg': 'success'
                }
                return Response(response, status=200)
            else:
                response = {
                    'key': kwargs['key'],
                    'value': None,
                    'msg': 'Not found'
                }
                return Response(response, status=404)
        elif request.method == 'PUT':
            if kwargs['key']:
                request_data = json.loads(request.body)
                new_value = request_data['new_value']
                value = redis_instance.get(kwargs['key'])
                if value:
                    redis_instance.set(kwargs['key'], new_value)
                    response = {
                        'key': kwargs['key'],
                        'value': value,
                        'msg': f"Successfully updated {kwargs['key']}"
                    }
                    return Response(response, status=200)
                else:
                    response = {
                        'key': kwargs['key'],
                        'value': None,
                        'msg': 'Not found'
                    }
                    return Response(response, status=404)
            elif request.method == 'DELETE':
                if kwargs['key']:
                    result = redis_instance.delete(kwargs['key'])
                    if result == 1:
                        response = {
                            'msg': f"{kwargs['key']} successfully deleted"
                        }
                        return Response(response, status=404)
                    else:
                        response = {
                            'key': kwargs['key'],
                            'value': None,
                            'msg': 'Not found'
                        }
                        return Response(response, status=404)


@api_view(['GET', 'POST'])
def post_object(request, *args, **kwargs):
    if request.method == 'GET':
        print('get request triggered successfully')
        items = {}
        count = 0
        for key in redis_instance.keys("*"):
            if type(key) is str:
                items[key.decode("utf-8")] = redis_instance.get(key)
                count += 1
        print(items, 'count:', count)
        response = {
            'count': count,
            'msg': f"Found {count} items.",
            'items': items
        }
        return Response(response, status=200)
    elif request.method == 'POST':
        # print('post request')
        item = json.loads(request.body)
        key = list(item.keys())[0]
        value = item[key]
        redis_instance.set(key, value)
        response = {
            'msg': f"{key} successfully set to {value}"
        }
        return Response(response, 201)


@api_view(['DELETE'])
def manage_post_object(request, *args, **kwargs):
    request_body = json.loads(request.body)
    print('****request body is ***', request_body)
    username = request_body.get('username')
    matched = request_body.get('matched')
    result = redis_instance.srem('pairs', username)
    second_result = redis_instance.srem('pairs', matched)
    if result == 1 and second_result == 1:
        response = {
            'msg': f"{username} and f{matched} successfully deleted"
        }
        return Response(response, status=404)
    else:
        response = {
            'key': username+matched,
            'value': None,
            'msg': 'Not found'
        }
        return Response(response, status=404)

@api_view(['GET', 'POST'])
def programmingChallenge(request, *args, **kwargs):
    if request.method == 'GET':
        items = []
        count = 0
        for elem in redis_instance.smembers("pairs"):
            # print('getting from redis', elem.decode("utf-8"))
            items.append(elem.decode("utf-8"))
            count += 1
        response = {
            'elements': items
        }
        return Response(response, status=200)
    elif request.method == 'POST':
        print('before we have', request.body)
        programmingChallengeReceived = request.body.decode("utf-8")
        print('received', programmingChallengeReceived)
        # for i in range(0, len(new_users)):
        #     # print('each iter', new_users[i])
        #     redis_instance.sadd('pairs', re.sub("[\"\']", "", new_users[i]).strip('[]'))
        response = {
            'msg': 'set contains'
        }
        return Response(response, 201)

@api_view(['GET','POST'])
@csrf_exempt
def leadership_update(request, *args, **kwargs):
    if request.method == 'GET':
        return Response('response', status=200)
    elif request.method == 'POST':
        print(request.body.decode("utf-8"))
        response = {
            'msg': f'set contains:'
        }
        return Response(response, 201)
    