import openai
from decouple import config
from django.http import HttpResponse
from django.views import View
from rest_framework.decorators import api_view
import os
from rest_framework.response import Response
from django.views.decorators.cache import never_cache
import logging

openai.api_key = config('OPEN_AI_API_KEY')


@api_view(['GET', 'POST'])
@never_cache
def get_help(request):
    # print('request', request)
    data = request.data
    # print('data', data)
    challenge_name = data.get('title')
    challenge_description = data.get('description')
    # print('challengeName', challenge_name)
    # print('description', challenge_description)
    # question_id = data['data']
    query = data.get('query', None)
    opt = data.get('opt', None)
    print('data', data)
    # print('opt****', opt)
    # print('name', challenge_name)
    # print('description', challenge_description)
    if opt == 'one':
        file_name = 'one.txt'
        print('opt one', opt, 'prompt', file_name)
    elif opt == 'two':
        file_name = 'mainclue.txt'
    elif opt == 'three':
        file_name = 'three.txt'
    elif opt == 'four':
        file_name = 'test_cases.txt'
    else:
        file_name = 'assistant.txt'
    try:
        prompt_file_path = os.path.join(os.path.dirname(__file__), file_name)
    except UnboundLocalError as e:
        logging.error(f'file_name is not defined: {str(e)}')
        return Response({'error': 'Internal server error'}, status=500)

    # Read the selected prompt text from your prompt.txt file
    with open(prompt_file_path, 'r') as file:
        prompt_text = file.read()
        # selected_prompt_text = prompts[prompt_levels.index(selected_prompt)]
    if (opt == 'four'):
        final_prompt = f"{prompt_text} Question: {challenge_name} Description: {challenge_description} testCases:{data.get('query')}"
        # print('data', data)
        # print('prompt', final_prompt)
    else:
        final_prompt = f"{prompt_text} Question: {challenge_name} Description: {challenge_description}"
        # print('finalPrompt, one', final_prompt)
    if opt == 'three':
        print('final')
    if query:
        final_prompt += f"Code: {query} Question: {challenge_name}"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that provides code help and helps explain coding questions."},
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
        last_message_content = response["choices"][-1]["message"]["content"].replace(
            "<p>", "").replace("</p>", "")
        print('****', last_message_content)
        return Response(last_message_content)

    # Handle the case where there is no valid response
    return HttpResponse("No response from the AI model.")


@api_view(['POST'])
class receive_response(View):
    def post(self, request):
        user_input = self.request.POST["user_input"]
        response = get_help(user_input)
        return HttpResponse(response)


@api_view(['POST'])
@never_cache
def get_answer(request):
    data = request.data
    challenge_name = data.get('title')
    challenge_description = data.get('description')
    query = data.get('query', None)
    file_name = 'optimalAnswer.txt'
    try:
        prompt_file_path = os.path.join(os.path.dirname(__file__), file_name)
    except UnboundLocalError as e:
        logging.error(f'file_name is not defined: {str(e)}')
        return Response({'error': 'Internal server error'}, status=500)

    # Read the selected prompt text from your prompt.txt file
    with open(prompt_file_path, 'r') as file:
        prompt_text = file.read()
    final_prompt = f"{prompt_text} Code: {query} Question: {challenge_name} Description: {challenge_description}"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that provides code help and helps explain coding questions."},
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
        last_message_content = response["choices"][-1]["message"]["content"].replace(
            "<p>", "").replace("</p>", "")
        print('****', last_message_content)
        return Response(last_message_content)

    # Handle the case where there is no valid response
    return HttpResponse("No response from the AI model.")
