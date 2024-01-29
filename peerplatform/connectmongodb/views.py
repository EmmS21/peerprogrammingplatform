from django.shortcuts import render
from rest_framework.response import Response
import urllib.request as urllib2
import json
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from django.views.decorators.cache import never_cache
import openai
from decouple import config

openai.api_key = config('OPEN_AI_API_KEY')

# Create your views here.
api_key = "5opRhTzTbi2N2A71LeLZBAhrZEDxjUakTc1UOncQ2qGjg5CE1IvGTfLBMFFpVyL2"
get_easy = "https://data.mongodb-api.com/app/data-pkrpq/endpoint/getEasyChallenge"
get_medium = "https://data.mongodb-api.com/app/data-pkrpq/endpoint/getMediumChallenge"
get_hard = "https://data.mongodb-api.com/app/data-pkrpq/endpoint/getHardChallenge"


# @api_view(('GET',))
# @renderer_classes((JSONRenderer,))
# @never_cache
# def retrieveEasy(request):
#     auth_handler = urllib2.HTTPBasicAuthHandler()
#     opener = urllib2.build_opener(auth_handler)
#     urllib2.install_opener(opener)
#     request = urllib2.Request(get_easy)
#     request.add_header('api-key', api_key)
#     result = urllib2.urlopen(request).read()
#     return Response(json.loads(result))

@api_view(('GET',))
@renderer_classes((JSONRenderer,))
@never_cache
def retrieveEasy(request):
    auth_handler = urllib2.HTTPBasicAuthHandler()
    opener = urllib2.build_opener(auth_handler)
    urllib2.install_opener(opener)

    while True:
        # Make the request to get a question
        question_request = urllib2.Request(get_easy)
        question_request.add_header('api-key', api_key)
        question_result = urllib2.urlopen(question_request).read()
        question_data = json.loads(question_result)

        # Check if the question has the "questionType" column
        if "questionType" in question_data:
            # Skip this question and retrieve another
            continue

        # If the question doesn't have "questionType", return the question
        return Response(question_data)


@api_view(('GET',))
@renderer_classes((JSONRenderer,))
@never_cache
def retrieveMedium(request):
    auth_handler = urllib2.HTTPBasicAuthHandler()
    opener = urllib2.build_opener(auth_handler)
    urllib2.install_opener(opener)
    request = urllib2.Request(get_medium)
    request.add_header('api-key', api_key)
    result = urllib2.urlopen(request).read()
    return Response(json.loads(result))


@api_view(('GET',))
@renderer_classes((JSONRenderer,))
@never_cache
def retrieveHard(request):
    auth_handler = urllib2.HTTPBasicAuthHandler()
    opener = urllib2.build_opener(auth_handler)
    urllib2.install_opener(opener)
    request = urllib2.Request(get_hard)
    request.add_header('api-key', api_key)
    result = urllib2.urlopen(request).read()
    return Response(json.loads(result))
