from django.contrib.auth.models import User, Group
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.views import APIView
from .models import UserEmail
from . import settings
from .serializers import RegisterSerializer, PasswordSerializer, UpdateUserSerializer, CustomTokenObtainPairSerializer, ProgrammingChallengeSerializer
from rest_framework.permissions import AllowAny
#restrict type of request that can be made to post request
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.viewsets import ReadOnlyModelViewSet
from accounts.models import models
from accounts.models import ProgrammingChallenge, Profile
from django.core.cache import caches
import redis
import random
from pyairtable import Table
from decouple import config



redis_instance = caches["default"]
api_key = config("AIRTABLE_API_KEY")
base_id = "appGriluJUAMFaUlp"
table_name = "DataTable"
emails_table = Table(api_key, base_id, table_name)


@api_view(['POST'])
def addEmail(request):
    print('test')
    email = request.data.get('email')
    if email:
        record = {"Name": email}
        emails_table.create(record)
        return Response({'status': 'Email added successfully'}, status=200)
    else:
        return Response({'status': 'Bad request'}, status=400)
    
@api_view(['GET'])
def CacheView(request):
    if request.method == 'GET':
        items = []
        pairs = {}
        for elem in redis_instance.smembers("pairs"):
            items.append(elem.decode("utf-8"))
        print(items)
        #creating dict with randomly matched pairs
        random.shuffle(items)
        item = iter(items)
        ds = dict(zip(item, item))
        return Response(ds, status=200)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = RegisterSerializer

    @action(detail=True, methods=['POST'])
    def set_password(self, request, pk=None):
        user = self.get_object()
        serializer = PasswordSerializer(data=request.data)

        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'status': 'password set'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

# class UpdateProfileView(generics.UpdateAPIView):
#     # permission_classes = [permissions.IsAuthenticated]
#     # authentication_classes = (TokenAuthentication,)
#     # lookup_field = 'username'
#     queryset = User.objects.all()
#     serializer_class = UpdateUserSerializer
#
#     @action(detail=True, methods=['PUT'])
#     def perform_update(self, serializer, pk=None):
#         serializer.save(user=self.request.user.id)


class UpdateProfileView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer
    def profile(request):
        if request.method == 'PUT':
            try:
                user = User.objects.get(id=request.user.id)
                serializer_user = UpdateUserSerializer(user, many=True)
                if serializer_user.is_valid():
                    serializer_user.save()
                    return Response(serializer_user)
            except User.DoesNotExist:
                return Response(data='no such user!', status=status.HTTP_400_BAD_REQUEST)



class UpdateProfileActive(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer


class ProgrammingChallengeView(ReadOnlyModelViewSet):
    serializer_class = ProgrammingChallengeSerializer
    queryset = ProgrammingChallenge.objects.all()

    @action(detail=False)
    def get_list(self, request):
        pass

@csrf_exempt
@api_view(('POST',))
def usernames_to_room_id(request):
    received = request.data['data'].split(",")
    print('received', received)
    user_one = received[0]
    user_two =  received[1]
    print('one: {} two: {}'.format(user_one, user_two))
    queried_id_user_one = int((get_user_id(user_one)))
    queried_id_user_two = int((get_user_id(user_two)))
    min_id = min(queried_id_user_one, queried_id_user_two)
    max_id = max(queried_id_user_one, queried_id_user_two)
    room_id = int('{}{}'.format(min_id, max_id))
    return Response(room_id)

def get_user_id(username):
    try:
        return User.objects.get(username=username).pk
    except User.DoesNotExist:
        return 'User does not exist'
