from django.shortcuts import render
import openai
from decouple import config
from django.http import HttpResponse, JsonResponse
from django.views import View
from rest_framework.decorators import api_view
import json
import markdown
from .models import UserQuestionRequest
import os
from rest_framework.response import Response
from django.views.decorators.cache import never_cache
import requests
import time

openai.api_key = config('OPEN_AI_API_KEY')

@api_view(['GET', 'POST'])
@never_cache
def get_help(request):
    md = markdown.Markdown(extensions=['extra'])
    data = request.data
    question_id = data['data']
    query =  data.get('query', None)
    file_name = 'second.txt' if query else 'prompt.txt'
    prompt_file_path = os.path.join(os.path.dirname(__file__), file_name)

    # Read the selected prompt text from your prompt.txt file
    with open(prompt_file_path, 'r') as file:
        prompt_text = file.read()
        # selected_prompt_text = prompts[prompt_levels.index(selected_prompt)]
    final_prompt = f"{prompt_text} Question: {question_id}"
    print('*****', final_prompt)
    if query:
        final_prompt += f"Code: {query}"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that provides code help."},
            {"role": "user", "content": final_prompt},
        ],
        temperature=0,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    if "choices" in response and len(response["choices"]) > 0:
        # Access the 'content' of the last message
        last_message_content = response["choices"][-1]["message"]["content"]
        last_message_content = last_message_content.replace("<p>", "").replace("</p>", "")
        return Response(last_message_content)

    # Handle the case where there is no valid response
    return HttpResponse("No response from the AI model.")

@api_view(['POST'])
class receive_response(View):
    def post(self, request):
        user_input = self.request.POST["user_input"]
        response = get_help(user_input)
        return HttpResponse(response)

