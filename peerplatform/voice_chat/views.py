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
        unique_room_name = str(uuid4())
        participant_label = 'User'
        is_moderator = True

        response = VoiceResponse()
        dial = Dial()
        dial.conference(
            name=unique_room_name,
            participant_label=participant_label,
            start_conference_on_enter=is_moderator,
        )
        response.append(dial)
        http_response = HttpResponse(response.to_xml(), content_type='application/xml')
        # http_response['X-Unique-Room-Name'] = unique_room_name
        return http_response
        # return JsonResponse({'room_name': unique_room_name, 'twiml': response.to_xml()}, content_type="application/xml")
    
    def selectModerator(self, users, current_user):
        curr_len = len(current_user)
        is_first = users[0:curr_len]
        return is_first == current_user



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
