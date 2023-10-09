# import json

# from channels.consumer import AsyncConsumer
# from time import sleep
# import random
# import redis
# from channels.generic.websocket import AsyncWebsocketConsumer
# from django.conf import settings
# from django.contrib.auth.models import User, AnonymousUser
# from channels.db import database_sync_to_async
# from asgiref.sync import async_to_sync
# from rest_framework.authtoken.models import Token
# from channels.middleware import BaseMiddleware
# import logging

# from django.shortcuts import redirect
# from django.utils import timezone

# from signup.serializers import UpdateUserSerializer
# from signup.views import UpdateProfileView


# logger = logging.getLogger('django')

# class synchronizeCodeEditorStates(AsyncWebsocketConsumer):
#     username_id = None
#     async def websocket_connect(self, event):
#         username = self.scope['user']
#         username_id = str(await self.get_user(username))
#         group_name = username_id
#         await self.channel_layer.group_add(
#             '{}'.format(group_name),
#             self.channel_name
#         )
#         await self.accept()

#     async def websocket_receive(self, event):
#         print('***received', event)
#         received = json.loads(event["text"])
#         # split_event = received.split(",")
#         # print('*** split event ***', split_event)
#         event_type = received["type"]
#         queried_id = int((await self.get_user_id(received["user"])))
#         data_to_be_sent = received["data"]
#         print('event type', event_type)
#         message = {
#             "data": data_to_be_sent
#         }
#         sleep(1)
#         await self.channel_layer.group_send(
#             '{}'.format(queried_id),
#             {
#                 "type": event_type,
#                 "message": json.dumps(message),
#                 "username": queried_id
#             })

#     async def websocket_disconnect(self, event):
#         print("who is disconnecting", self.scope['user'])
#         self.channel_layer.group_discard(
#             '{}'.format(self.username_id),
#             self.channel_name
#         )
#     async def send_message(self, event):
#         message = event['message']
#         await self.send(text_data=json.dumps({
#             'type': 'send_message',
#             'text': message
#         }))
#     async def send_challenge(self, event):
#         message = event['message']
#         await self.send(text_data=json.dumps({
#             'type': 'send_challenge',
#             'text': message
#         }))

#     @database_sync_to_async
#     def get_user(self, user_id):
#         try:
#             return User.objects.get(username=user_id).pk
#         except User.DoesNotExist:
#             return AnonymousUser()
    
#     @database_sync_to_async
#     def get_user_id(self, username):
#         try:
#             return User.objects.get(username=username).pk
#         except User.DoesNotExist:
#             return 'User does not exist'

# class synchronizeChallenges(AsyncWebsocketConsumer):
#     username_id = None
#     async def websocket_connect(self, event):
#         username = self.scope['user']
#         username_id = str(await synchronizeCodeEditorStates.get_user(username))
#         group_name = username_id
#         await self.channel_layer.group_add(
#             '{}'.format(group_name),
#             self.channel_name
#         )
#         await self.accept()

#     async def websocket_receive(self, event):
#         received = event["text"]
#         split_event = received.split(",")
#         print('*** split event in SyncChallenge ***', split_event)
#         queried_id = int((await synchronizeCodeEditorStates.get_user_id(split_event[0])))
#         data_to_be_sent = split_event[1]
#         message = {
#             "data": data_to_be_sent
#         }
#         sleep(1)
#         await self.channel_layer.group_send(
#             '{}'.format(queried_id),
#             {
#                 "type": "send.challenge",
#                 "challenge": json.dumps(message),
#                 "username": queried_id
#             })

#     async def websocket_disconnect(self, event):
#         print("who is disconnecting", self.scope['user'])
#         self.channel_layer.group_discard(
#             '{}'.format(self.username_id),
#             self.channel_name
#         )
#     async def send_challenge(self, event):
#         challenge = event['challenge']
#         await self.send(text_data=json.dumps({
#             'type': 'send_challenge',
#             'text': challenge
#         }))