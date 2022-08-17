from datetime import timedelta

import online_users.models
from django.contrib.auth.models import User, Group
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework import permissions
from .serializers import RegisterSerializer, PasswordSerializer, UpdateUserSerializer, CustomTokenObtainPairSerializer, \
    ProgrammingChallengeSerializer, OnlineUsersSerializer, UserSerializer
from rest_framework.permissions import AllowAny
# restrict type of request that can be made to post request
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.viewsets import ReadOnlyModelViewSet
from accounts.models import models
from accounts.models import Profile

from accounts.models import ProgrammingChallenge

from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver

from django.contrib.auth import get_user_model


# from accounts.models import LoggedUser

# class OnlineNowMixin:
#     def initial(self, request, *args, **kwargs):
#         super().initial(request, *args, **kwargs)
#         user = request.user
#         if not user.is_authenticated:
#             return
#         online_users.models.OnlineUserActivity.update_user_activity(user)


class OnlineUsers(viewsets.ModelViewSet):
    try:
        queryset = online_users.models.OnlineUserActivity.get_user_activities(timedelta(seconds=120))
        # queryset = LoggedUser.objects.all()
    except TypeError:
        print('No users logged in')
    serializer_class = OnlineUsersSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = RegisterSerializer

    # permission_classes = [permissions.IsAuthenticated]

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

    @receiver(user_logged_in)
    def got_online(sender, user, request, **kwargs):
        user.profile.is_online = True
        user.profile.save()

    @receiver(user_logged_out)
    def got_offline(sender, user, request, **kwargs):
        user.profile.is_online = False
        user.profile.save()

    # def see_users(self):
    #     user_status = online_users.models.OnlineUserActivity.get_user_activities(timedelta(minutes=15))
    #     users = (user for user in user_status)
    #     context = {"online_users"}


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


class ProgrammingChallengeView(ReadOnlyModelViewSet):
    serializer_class = ProgrammingChallengeSerializer
    queryset = ProgrammingChallenge.objects.all()

    @action(detail=False)
    def get_list(self, request):
        pass


class GetAllUsers(viewsets.ModelViewSet):
    serializer_class = RegisterSerializer
    # User = get_user_model()
    queryset = User.objects.all()
    # .order_by('last_login')

# class GroupViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer
#     # permission_classes = [permissions.IsAuthenticated]
