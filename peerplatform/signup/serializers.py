from django.contrib.auth.models import User
from rest_framework import serializers
#added more imports based on simpleJWT tutorial
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer;
from rest_framework_simplejwt.views import TokenObtainPairView;
from accounts.models import Profile


#changed from serializers.HyperLinked to ModelSerializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        #removed url from fields
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'city', 'country', 'bio']
        extra_kwargs = {
            'password': {'write_only': True},
        }
        def create(self,validated_data):
            user = Profile.objects.create_user(
                                            username=validated_data['username'],
                                            first_name=validated_data['first_name'],
                                            last_name=validated_data['last_name'],
                                            city=validated_data['city'],
                                            country=validated_data['country'],
                                            bio=validated_data['bio'],
                                            email=validated_data['email'])
            user.set_password(validated_data['password'])
            user.save()
            return user

#customizing the payload we get from our access tokens
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        # token['country'] = user.country
        # token['city'] = user.city
        # token['bio'] = user.bio
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)


class PasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
