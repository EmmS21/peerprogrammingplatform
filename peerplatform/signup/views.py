from django.contrib.auth.models import User, Group
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from pywebpush import webpush
from webpush import send_user_notification
import json
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.views import APIView

from . import settings
from .serializers import RegisterSerializer, PasswordSerializer, UpdateUserSerializer, CustomTokenObtainPairSerializer, ProgrammingChallengeSerializer
from rest_framework.permissions import AllowAny
#restrict type of request that can be made to post request
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.viewsets import ReadOnlyModelViewSet
from accounts.models import models
from accounts.models import Profile
from webpush.utils import send_to_subscription, _process_subscription_info
from django.core.cache import cache
import redis
import random

redis_instance = redis.StrictRedis(host=settings.REDIS_HOST,
                                   port=settings.REDIS_PORT, db=0,
                                   )

# if request.method == 'GET':
#     items = []
#     count = 0
#     for elem in redis_instance.smembers("pairs"):
#         print('getting from redis', elem.decode("utf-8"))
#         items.append(elem.decode("utf-8"))
#         count += 1
#     response = {
#         'elements': items
#     }
#     return Response(response, status=200)
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
    # subscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/e4uDcE68SzE:APA91bGqDa_-Bf0habaBR-HyoCS0nNHRJ5bfu9RFwqS9IfhE0i5Fbi9SM39BKER1YNq4yX8QFB7GYNORrWNckj1q8X69s_0vPKKqxEZ5ih_Z4jrVViBp_rrTA7Xx6YwRy9WTHjR0pMlm","expirationTime":None,"keys":{"p256dh":"BNROVejeCHDw6vRdclq4-EZCVdwM19gfkQcQQS0NbxMLZwhnqKEkt_pM7EC3-v7xdalGUlQXkOuyOCeulCPR5ZM","auth":"hcJPvZcbWftScKkKB4QMlg"}}
    # payload = {"head": "Welcome!", "body": "Hello World"}
    # webpush_settings = getattr(settings, 'WEBPUSH_SETTINGS', {})
    # vapid_private_key = webpush_settings.get('VAPID_PRIVATE_KEY')
    # vapid_admin_email = webpush_settings.get('VAPID_ADMIN_EMAIL')
    #
    # vapid_data = {
    #     'vapid_private_key': vapid_private_key,
    #     'vapid_claims': {"sub": "mailto:{}".format(vapid_admin_email)}
    # }
    # # webpush(subscription_info=subscription,
    # #         data=json.dumps(payload),
    # #         vapid_private_key=vapid_private_key)
    # print('queryset:', queryset[0])
    # send_user_notification(user=subscription, payload=payload, ttl=0)
    # changed name from UserSerializer to RegisterSerializer
    serializer_class = RegisterSerializer

    # permission_classes = [permissions.IsAuthenticated]
    # print(queryset)

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

# class GroupViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer
#     # permission_classes = [permissions.IsAuthenticated]

@require_POST
@csrf_exempt
def send_push(request):
    try:
        body = request.body
        data = json.loads(body)
        subscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/e4uDcE68SzE:APA91bGqDa_-Bf0habaBR-HyoCS0nNHRJ5bfu9RFwqS9IfhE0i5Fbi9SM39BKER1YNq4yX8QFB7GYNORrWNckj1q8X69s_0vPKKqxEZ5ih_Z4jrVViBp_rrTA7Xx6YwRy9WTHjR0pMlm",
                        "expirationTime": None,
                        "keys": {"p256dh": "BNROVejeCHDw6vRdclq4-EZCVdwM19gfkQcQQS0NbxMLZwhnqKEkt_pM7EC3-v7xdalGUlQXkOuyOCeulCPR5ZM",
                                 "auth": "hcJPvZcbWftScKkKB4QMlg"}}
        if 'head' not in data or 'body' not in data or 'id' not in data:
            return JsonResponse(status=400, data={"message": "Invalid data format"})
        user_id = data['id']
        user = get_object_or_404(User, pk=user_id)
        payload = {'head': data['head'], 'body': data['body']}
        send_user_notification(user=subscription, payload=payload, ttl=1000)
        return JsonResponse(status=200, data={"message": "Web push successful"})
    except TypeError:
        return JsonResponse(status=500, data={"message": "An error occurred"})

# @require_POST
# @csrf_exempt
# def send_push_to_two_users(firstUser, secondUserID, title, body, url):
#     secondUser = User.objects.get(id=secondUserID)
#     payload = {"head": title, "body": body, "url": url}
#     send_user_notification(user=firstUser, payload=payload, ttl=1000)
#     send_user_notification(user=secondUser, payload=payload, ttl=1000)

# def testing(request):
#     return render(request, 'index.html', {'user': request.user.get_username()})
