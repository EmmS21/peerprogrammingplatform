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
import logging
logger = logging.getLogger('django')



redis_instance = redis.StrictRedis(host=settings.REDIS_HOST_LAYER,
                                   port=settings.REDIS_PORT_LAYER, db=0
                                   )


# users = {}
# group_name = ''

class PracticeConsumer(AsyncConsumer):
    username_id = None
    async def websocket_connect(self, event):
        # when websocket connects
        # users.append(self.scope['user'])
        #this should be named user_id
        username = self.scope['user']
        print('username received in scope is', username)
        #get user_id from username connected to websocket
        username_id = str(await self.get_user(username))
        group_name = username_id
        print('username id on connect is', username_id)
        #subscribe user to group
        await self.channel_layer.group_add(
            '{}'.format(username_id),
            self.channel_name
        )
        await self.send({"type": "websocket.accept", })

        # await self.send({"type": "websocket.send", "text": 'websocket is workingget['username]

    async def websocket_receive(self, event):
        received = event["text"] 
        invite_data = received.split()
        matched_user = invite_data[0]
        username = invite_data[2]
        user_id = str(await self.get_user(matched_user))
        print(f"receiving {invite_data}")
        my_response = {
            "message": "!!!!the websocket is sending this back!!!!"
        }
        sleep(1)
        print('we are sending to group {}'. format(user_id))
        await self.channel_layer.group_send(
            '{}'.format(1),
            {
                "type": "send.message",
                "message": json.dumps(my_response),
                "matched_user": matched_user,
                "username": username
            })

    async def websocket_disconnect(self, event):
        print("disconnected", event)
        self.channel_layer.group_discard(
            '{}'.format(self.username_id),
            self.channel_name
        )

    async def send_message(self, event):
        raise Exception("Just test")
        # message = event['message']
        # logger.info(f'sending message inside presenter{message}')
        # await self.send({
        #     'message': message
        # })

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(username=user_id).pk
        except User.DoesNotExist:
            return AnonymousUser()

#if using http request, when a person joins waiting room, they make a request to the backend
#if no-one return a message indicating this || volume -> backroute job that will run every x minutes => cronjob
#redirecting pairs to their appropriate rooms -> window.location.href //from the frontend //react router
