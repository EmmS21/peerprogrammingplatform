from django.shortcuts import render
import openai
from decouple import config
from django.http import HttpResponse, JsonResponse
from django.views import View
from rest_framework.decorators import api_view
import json
import markdown

openai.api_key = config('OPEN_AI_API_KEY')

@api_view(['GET', 'POST'])
def get_help(request):
    md = markdown.Markdown(extensions=['extra'])
    data = request.data
    response = openai.Completion.create(
        engine="code-davinci-002",
        prompt="Return a solution for Leetcode question {}".format(data['data']),
        temperature=0,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=["Problem:"]
    )
    print('response', md.convert(response["choices"][0]["text"]))
    return HttpResponse(md.convert(response["choices"][0]["text"]))
    # return HttpResponse(json.dumps(response["choices"][0]["text"]))

@api_view(['POST'])
class receive_response(View):
    def post(self, request):
        user_input = self.request.POST["user_input"]
        response = get_help(user_input)
        return HttpResponse(response)
