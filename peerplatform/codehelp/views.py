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

openai.api_key = config('OPEN_AI_API_KEY')

@api_view(['GET', 'POST'])
def get_help(request):
    md = markdown.Markdown(extensions=['extra'])
    user_id = request.data['user']
    data = request.data
    question_id = data['data']
    prompt_file_path = os.path.join(os.path.dirname(__file__), 'prompt.txt')

    UserQuestionRequest.objects.filter(user_id=user_id).update(request_count=0)
    UserQuestionRequest.objects.update_or_create(
        user_id=user_id,
        question_id=question_id,
        defaults={'request_count': 1}
    )
    # Determine the user's request count for the current question
    request_count = UserQuestionRequest.objects.get(user_id=user_id, question_id=question_id).request_count
    print('current', request_count)
    # Select the prompt text from the list based on the request count
    prompt_levels = ["ONE", "TWO", "THREE", "FOUR", "FIVE"]
    selected_prompt = prompt_levels[min(request_count - 1, len(prompt_levels) - 1)]  # Ensure it's within valid range
    # Read the selected prompt text from your prompt.txt file
    with open(prompt_file_path, 'r') as file:
        prompts = file.read().split('\n\n')
        selected_prompt_text = prompts[prompt_levels.index(selected_prompt)]
    prompt_string = f"{selected_prompt_text} 'code:{data['code']}' 'language:{data['language']}' 'question:{data['data']}'"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that provides code help."},
            {"role": "user", "content": prompt_string},
        ],
        temperature=0,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    if "choices" in response and len(response["choices"]) > 0:
        # Access the 'content' of the last message
        last_message_content = response["choices"][-1]["message"]["content"]
        return HttpResponse(md.convert(last_message_content))

    # Handle the case where there is no valid response
    return HttpResponse("No response from the AI model.")

@api_view(['POST'])
class receive_response(View):
    def post(self, request):
        user_input = self.request.POST["user_input"]
        response = get_help(user_input)
        return HttpResponse(response)
