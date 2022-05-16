from django.contrib.auth.models import User, Group
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework import permissions
from .serializers import RegisterSerializer, PasswordSerializer, UpdateUserSerializer, CustomTokenObtainPairSerializer, ProgrammingChallengeSerializer
from rest_framework.permissions import AllowAny
#restrict type of request that can be made to post request
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.viewsets import ReadOnlyModelViewSet
from accounts.models import models

from accounts.models import ProgrammingChallenge
#
# @api_view(['POST',])
# def registration_view(request):
#     if request.method == 'POST':
#         serializer = RegisterSerializer(data=request.data)
#         data = {}
#         if serializer.is_valid():
#             user = serializer.save()
#             data['response'] = 'successfully registered new user'
#             data['email'] = user.email
#             data['username'] = user.username
#         else:
#             data ='error';
#         return Response(data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    #changed name from UserSerializer to RegisterSerializer
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
