from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse, Dial

@method_decorator(csrf_exempt, name="dispatch")
class RoomView(View):
    def post(self, request, *args, **kwargs):
        room_name = request.POST["roomName"]
        participant_label = request.POST["participantLabel"]
        response = VoiceResponse()
        dial = Dial()
        dial.conference(
            name=room_name,
            participant_label=participant_label,
            start_conference_on_enter=True,
        )
        response.append(dial)
        return HttpResponse(response.to_xml(), content_type="text/xml")
