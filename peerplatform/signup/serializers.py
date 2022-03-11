from django.contrib.auth.models import User
from rest_framework import serializers
#added more imports based on simpleJWT tutorial
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

#changed from serializers.HyperLinked to ModelSerializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        #removed url from fields
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only':True},
        }
        #added based on simplejwt tutorial
        def create(self,validated_data):
            user = User.objects.create_user(validated_data['username'],
                                            password=validated_data['password'],
                                            email=validated_data['email'])
            return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)


class PasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
