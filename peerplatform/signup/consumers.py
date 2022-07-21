from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
import json
from django.contrib.auth.models import User, AnonymousUser
from django.conf import settings

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except:
        return AnonymousUser()
@database_sync_to_async
def create_notification(receiver,typeof="task_created",status="unread"):
    notification_to_create = notifications.objects.create(user_revoker=receiver,type_of_notification=typeof)
    print('I am here to help')
    return (notification_to_create.user_revoker.username,notification_to_create.type_of_notification)

class NotificationConsumer(AsyncWebsocketConsumer):
    webpush_settings = getattr(settings, 'WEBPUSH_SETTINGS', {})
    vapid_key = webpush_settings.get('VAPID_PUBLIC_KEY')

    async def websocket_connect(self, event):
        # print('scope is:', self.scope)
        await self.accept()
        await self.send(json.dumps({
            "type": "connection_established",
            "text": "You have been matched, click accept to redirect to your pair programming session"
        }))
        self.room_name='test_consumer'
        self.room_group_name='test_consumer_group'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        self.send(json.dumps({
            "type": "websocket.send",
            "text": "room made"
        }))
        #service worker - runs inside browser, will consume message from websocket, will read message and display a notification
        #similar to chat app, pass in name when you open a websocket
        #backend server will store info as dictionary - when server sends notification it knows who to
        #send room in backend to both users so they click on this
        #windows.location/react router
    # def save_subscription(self, subscription):
    #     return

    async def websocket_receive(self, event):
        print(event)
        data_to_get = json.loads(event['text'])
        user_to_get = await get_user(int(data_to_get))
        print(user_to_get)
        get_of = await create_notification(user_to_get)
        self.room_group_name='test_consumer_group'
        channel_layer = get_channel_layer()

        await (channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "send_notification",
                "value": json.dumps(get_of)
            }
        )
        print('receive', event)

        async def websocket_disconnect(self, event):
            print('disconnect', event)

        async def send_notification(self, event):
            await self.send(json.dumps({
                "type": "websocket.send",
                "data": event
            }))
            print('I am here')
            print(event)
