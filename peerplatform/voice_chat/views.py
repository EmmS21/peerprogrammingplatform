from Cython import typeof
from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse, Dial
from django.conf import settings
from twilio.jwt.access_token import AccessToken, grants
from twilio.rest import Client
import jwt
import pprint

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

@method_decorator(csrf_exempt, name="dispatch")
class RoomView(View):
    def get(self, request, *args, **kwargs):
        rooms = client.conferences.stream(
            status="in-progress"
        )
        rooms_reps = [
            {
                "room_name": conference.friendly_name,
                "sid": conference.sid,
                "participants": [
                    p.label for p in conference.participants.list()
                ],
                "status": conference.status,
            } for conference in rooms]
        return JsonResponse({"rooms": rooms_reps})

    def post(self, request, *args, **kwargs):
<<<<<<< HEAD
        room_name = request.POST.get("roomName", "default")
        participant_label = request.POST.get("participantLabel","default")
        response = VoiceResponse()
        dial = Dial()
        dial.conference(
            name=room_name,
            participant_label=participant_label,
            start_conference_on_enter=True,
        )
        print(dial)
        response.append(dial)
        return HttpResponse(response.to_xml(), content_type="text/xml")
=======
        twilio_conf = []
        for x, y in self.items.items():
            print('inside for loop', x, y)
            # room_name = request.POST.get("roomName", "default")
            room_name = str(x)+str(y)
            print('room name is', room_name)
            # participant_label = request.POST.get("participantLabel", "default")
            participant_label = str(x)+str(y)
            response = VoiceResponse()
            dial = Dial()
            dial.conference(
                name=room_name,
                participant_label=participant_label,
                start_conference_on_enter=True,
            )
            print(dial)
            response.append(dial)
            print('type of resp:', type(response))
            twilio_conf.append(response)
            print('twilio_conference list:', twilio_conf)
        redirect('http://localhost:3000/rooms/1')
        return HttpResponse(twilio_conf[0].to_xml(), content_type="text/xml")

>>>>>>> parent of 96faf56 (joining rooms approach)

class TokenView(View):
    def get(self, request, username, *args, **kwargs):
        voice_grant = grants.VoiceGrant(
            outgoing_application_sid=settings.TWIML_APPLICATION_SID,
            incoming_allow=True,
        )
        access_token = AccessToken(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_API_KEY,
            settings.TWILIO_API_SECRET,
            identity=username
        )
        access_token.add_grant(voice_grant)
        jwt_token = access_token.to_jwt()
        # print(type(jwt_token))
        return JsonResponse({"token": jwt_token})
