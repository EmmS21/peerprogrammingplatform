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
        # decode_request = request.body.decode("utf-8")
        # request_body = json.loads(decode_request)
        # print('****request body', request_body)
        room_name = request.POST.get("roomName", "default")
        participant_label = request.POST.get("participantLabel", "default")
        response = VoiceResponse()
        dial = Dial()
        dial.conference(
            name=room_name,
            participant_label=participant_label,
            start_conference_on_enter=True,
        )
        response.append(dial)
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
        if isinstance(jwt_token, str):
            result_token = jwt_token
        else:
            result_token = jwt_token.decode("utf-8")

        full_data = {'token': result_token}
        return JsonResponse(json.dumps(full_data), content_type="application/json", safe=False)
