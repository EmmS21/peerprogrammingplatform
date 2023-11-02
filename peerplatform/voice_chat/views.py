from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse, Dial
from django.conf import settings
from twilio.jwt.access_token import AccessToken, grants
from twilio.rest import Client
import json
import redis
from django.conf import settings
from django.contrib.auth.models import User
from uuid import uuid4


client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

@method_decorator(csrf_exempt, name="dispatch")
class RoomView(View):
    def get(self, request, *args, **kwargs):
        rooms = client.conferences.stream()
        # print('rooms', rooms)
        rooms_reps = [
            {
                "room_name": conference.friendly_name,
                "sid": conference.sid,
                "participants": [
                    p.label for p in conference.participants.list()
                ],
                "status": conference.status,
            } for conference in rooms
        ]
        # print(f"Queried rooms: {rooms_reps}")
        return JsonResponse({"rooms": rooms_reps})

    def post(self, request, *args, **kwargs):
        # decode_request = request.body.decode("utf-8")
        unique_room_name = str(uuid4())
        participant_label = 'emm'
        is_moderator = True

        response = VoiceResponse()
        dial = Dial()
        dial.conference(
            name=unique_room_name,
            participant_label=participant_label,
            start_conference_on_enter=is_moderator,
        )
        response.append(dial)
        http_response = HttpResponse(response.to_xml(), content_type="text/xml")
        print('http', response.to_xml())
        return http_response
        
        # return HttpResponse(response.to_xml(), content_type="text/xml")
@method_decorator(csrf_exempt, name="dispatch")
class JoinCoference(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError as e:
            print(f"Failed to decode JSON: {e}")
        room_name = data.get('roomName')
        print('rm', room_name)
        response = VoiceResponse()
        with response.dial() as dial:
            dial.conference(room_name)
        print('sec resp', response.to_xml)
        return HttpResponse(response.to_xml(), content_type="text/xml")

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
        # print(f"JWT Token: {jwt_token}") 
        if isinstance(jwt_token, str):
            result_token = jwt_token
        else:
            result_token = jwt_token.decode("utf-8")

        full_data = {'token': result_token}
        # print('full data', full_data)
        return JsonResponse(json.dumps(full_data), content_type="application/json", safe=False)
