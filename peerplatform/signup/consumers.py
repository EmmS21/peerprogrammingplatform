import asyncio
import json
from channels.consumer import AsyncConsumer
from random import randint
from time import sleep
from channels.db import database_sync_to_async
import random

class PracticeConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        # when websocket connects
        print("connected", event)
        # self.accept
        await self.send({"type": "websocket.accept", })
        # await self.send({"type": "websocket.send", "text": 'websocket is working'})
        #

    async def websocket_receive(self, event):
        # when messages is received from websocket, ensure there are no duplicates
        users_list = event['text'].split(',')
        #randomize tuple order
        random.shuffle(users_list)
        #remove possible duplicates
        elem = iter(set(users_list))
        #dict with matched users
        avail_users = dict(zip(elem, elem))
        print("receiving this:", avail_users)
        #create conference room names
        # room_name = []
        # #list of conf rooms concatenating key, value pairs
        # for k, v in avail_users.items():
        #     room_name.append(k+v)
        #do process, is thing available? wait else send
        #send and close?

        sleep(1)
        await self.send({
            "type": "websocket.send",
            "text": json.dumps(avail_users),
        })

    async def websocket_disconnect(self, event):
        # when websocket disconnects
        print("disconnected", event)

#if using http request, when a person joins waiting room, they make a request to the backend
#if no-one return a message indicating this || volume -> backroute job that will run every x minutes => cronjob
#redirecting pairs to their appropriate rooms -> window.location.href //from the frontend //react router
