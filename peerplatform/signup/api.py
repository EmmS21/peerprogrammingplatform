from rest_framework import generics, permissions, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

#Register API
class RegisterApi(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    #remove this if it doesn't work
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)
    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User Created Successfully.  Now perform Login to get your token",
        })
    # #allow for anonymous signup
    # def get_permissions(self):
    #     if self.action == 'create':
    #         return [AllowAny()]
    #     else:
    #         return super().get_permissions()
    #
    # def get_authenticators(self):
    #     if self.action == 'create':
    #         return []
    #     else:
    #         return super().get_authenticators()
    #
