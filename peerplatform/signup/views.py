from django.contrib.auth.models import User, Group
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework import permissions
from .serializers import RegisterSerializer, PasswordSerializer
from rest_framework.permissions import AllowAny
#restrict type of request that can be made to post request
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny

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


# class GroupViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer
#     # permission_classes = [permissions.IsAuthenticated]
