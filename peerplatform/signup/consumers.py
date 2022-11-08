import json

from channels.consumer import AsyncConsumer
from time import sleep
import random
import redis
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from django.contrib.auth.models import User, AnonymousUser
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from rest_framework.authtoken.models import Token
from channels.middleware import BaseMiddleware
import logging

from django.shortcuts import redirect
from django.utils import timezone

from signup.serializers import UpdateUserSerializer
from signup.views import UpdateProfileView


logger = logging.getLogger('django')

class PracticeConsumer(AsyncWebsocketConsumer):
    username_id = None
    async def websocket_connect(self, event):
        #this should be named user_id
        username = self.scope['user']
        username_id = str(await self.get_user(username))
        # print('username is connected: ', username)
        group_name = username_id
        # print("user's group name", group_name)
        #subscribe user to group
        await self.channel_layer.group_add(
            '{}'.format(group_name),
            self.channel_name
        )
        await self.accept()

    async def websocket_receive(self, event):
        # print('what is event', event)
        received = event["text"]
        split_event = received.split(",")
        # print('split event', split_event)
        queried_id = int((await self.get_user_id(split_event[0])))
        data_to_be_sent = split_event[1]
        # list_to_send = [queried_id, current_id]
        # print('we are sending', data_to_be_sent)
        message = {
            "data": data_to_be_sent
        }
        # print('list', list_to_send)
        sleep(1)
        await self.channel_layer.group_send(
            '{}'.format(queried_id),
            {
                "type": "send.message",
                "message": json.dumps(message),
                "username": queried_id
            })

    async def websocket_disconnect(self, event):
        print("who is disconnecting", self.scope['user'])
        self.channel_layer.group_discard(
            '{}'.format(self.username_id),
            self.channel_name
        )
    async def send_message(self, event):
        message = event['message']
        # logger.info(f'sending message inside presenter{message}')
        await self.send(text_data=json.dumps({
            'type': 'send_message',
            'text': message
        }))

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(username=user_id).pk
        except User.DoesNotExist:
            return AnonymousUser()
    
    @database_sync_to_async
    def get_user_id(self, username):
        try:
            return User.objects.get(username=username).pk
        except User.DoesNotExist:
            return 'User does not exist'
    