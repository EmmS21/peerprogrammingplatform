import json

from channels.consumer import AsyncConsumer
from time import sleep
import random
import redis
from django.conf import settings
from django.contrib.auth.models import User, AnonymousUser
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from rest_framework.authtoken.models import Token
from channels.middleware import BaseMiddleware


redis_instance = redis.StrictRedis(host=settings.REDIS_HOST_LAYER,
                                   port=settings.REDIS_PORT_LAYER, db=0
                                   )


users = {}

class PracticeConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        # when websocket connects
        # users.append(self.scope['user'])
        username = self.scope['user']
        #subscribe user to group
        await self.channel_layer.group_add('{}'.format(username), self.channel_name)
        await self.send({"type": "websocket.accept", })
        # await self.send({"type": "websocket.send", "text": 'websocket is workingget['username]

    async def websocket_receive(self, event):
        received = event["text"]
        user_and_id = received.split()
        username = user_and_id[0]
        print('username', username)
        user_id = str(await self.get_user(username))
        room_id = str(user_and_id[1])
        # username_id = str(await self.get_user(user_and_id[2]))
        # async_to_sync(self.channel_layer.group_add)(
        #     self.user_id
        # )
        # async_to_sync(self.channel_layer.group_add)(
        #     self.username_id
        # )
        # print('groups', groups)
        # print('user id is', user_id)
        sleep(1)
        await self.channel_layer.group_send(
            '{}'.format(username),
            {
                "type": "websocket.send",
                "text": "checking if this works",
            },
        )


        # await self.send({
        #     "type": "websocket.send",
        #     "text": "testing message",
        #     # user_id + ' ' + room_id,
        #     "user": "testingUser"
        #         # {"matchedUser": user_id, "roomName": room_id },
        # })

    async def websocket_disconnect(self, event):
        # when websocket disconnects
        print("disconnected", event)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(username=user_id).pk
        except User.DoesNotExist:
            return AnonymousUser()

#if using http request, when a person joins waiting room, they make a request to the backend
#if no-one return a message indicating this || volume -> backroute job that will run every x minutes => cronjob
#redirecting pairs to their appropriate rooms -> window.location.href //from the frontend //react router
