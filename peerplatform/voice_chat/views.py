from django.http import HttpResponse, JsonResponse
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

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
redis_instance = redis.StrictRedis(host=settings.REDIS_HOST_LAYER,
                                   port=settings.REDIS_PORT_LAYER, db=0
                                   )

@method_decorator(csrf_exempt, name="dispatch")
class RoomView(View):
    items = {}
    for key in redis_instance.keys("*"):
        items[key.decode("utf-8", 'ignore')] = redis_instance.get(key)
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
        for x, y in self.items.items():
            # room_name = request.POST.get("roomName", "default")
            room_name = request.POST.get(str(x)+str(y), "default")
            print('room name is', room_name)
            # participant_label = request.POST.get("participantLabel", "default")
            participant_label = request.POST.get(str(x)+str(y), "default")
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
        full_data = { 'token': jwt_token.decode()}
        # print(type(jwt_token))
        return JsonResponse(json.dumps(full_data), content_type="application/json", safe=False)
