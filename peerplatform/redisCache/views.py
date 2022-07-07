import json
from django.conf import settings
import redis
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet

redis_instance = redis.StrictRedis(host=settings.REDIS_HOST,
                                   port=settings.REDIS_PORT, db=0, password=settings.REDIS_PASSWORD)
@api_view(['GET', 'POST'])
def manage_items(request, *args, **kwargs):
    if request.method == 'GET':
        items = {}
        count = 0
        for key in redis_instance.keys("*"):
            items[key.decode("utf-8")] = redis_instance.get(key)
            count += 1
        response = {
            'count': count,
            'msg': f"Found {count} items.",
            'items': items
        }
        return Response(response, status=200)
    elif request.method == 'POST':
        item = json.loads(request.body)
        keys = list(item.keys())
        values = list(item.values())
        for i in range(0, len(keys)):
            redis_instance.set(keys[i], values[i])
        response = {
            'msg': f"{keys} successfully set to {values}"
        }
        return Response(response, 201)

# def postToRedis(request):
#     online_users = User.objects.filter(is_online='true').order_by('-date_joined')
#     print('online users are', online_users)
#     queue_of_users = { d['username'] for d in online_users }
#     keys = list(queue_of_users.keys())
#     values = list(queue_of_users.values())
#     for i in range(0, len(keys)):
#         redis_instance.set(keys[i], values[i])
#     response = {
#         'msg': f"{keys} successfully set to {values}"
#     }
#     return Response(response, 201)




@api_view(['GET', 'PUT', 'DELETE'])
def manage_item(request, *args, **kwargs):
    if request.method == 'GET':
        if kwargs['key']:
            value = redis_instance.get(kwargs['key'])
            if value:
                response={
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

#user makes a request to backend to find a match
#rest of the work backend
#talk to redis, find list of avail users
#try to ask users one by one until they find first available users
#user joins