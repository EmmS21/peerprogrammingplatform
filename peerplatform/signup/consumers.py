import json

from channels.consumer import AsyncConsumer
from time import sleep
import random
import redis
from django.conf import settings
from django.contrib.auth.models import User, AnonymousUser
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async


redis_instance = redis.StrictRedis(host=settings.REDIS_HOST_LAYER,
                                   port=settings.REDIS_PORT_LAYER, db=0
                                   )
# @database_sync_to_asy

class PracticeConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        # when websocket connects
        print("connected", event)
        # self.accept
        await self.send({"type": "websocket.accept", })
        # await self.send({"type": "websocket.send", "text": 'websocket is workingget['username]
    async def websocket_receive(self, event):
        received = event["text"]
        user_and_id = received.split()
        print('we are initially getting', user_and_id)
        user_id = str(await self.get_user(user_and_id[0]))
        room_id = str(user_and_id[1])
        # print('user id is', user_id)
        sleep(1)
        await self.send({
            "type": "websocket.send",
            "text": user_id+' '+room_id,
                # {"matchedUser": user_id, "roomName": room_id },
        })

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
