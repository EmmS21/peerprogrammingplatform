from django.contrib.auth.models import User
# from django.contrib.auth import get_user_model
from rest_framework import serializers
#added more imports based on simpleJWT tutorial
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer;
from rest_framework_simplejwt.views import TokenObtainPairView;
import json
from accounts.models import Profile


# User = get_user_model()
#changed from serializers.HyperLinked to ModelSerializer and then to RegisterSerializer to accurately reflect what this does
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        #removed url from fields
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'city', 'country', 'bio']
        extra_kwargs = {
            'password': {'write_only': True},
        }
        def create(self,validated_data):
            user = User.objects.create_user(
                                            username=validated_data['username'],
                                            first_name=validated_data['first_name'],
                                            last_name=validated_data['last_name'],
                                            email=validated_data['email'])
            user.set_password(validated_data['password'])
            user.save()
            #added fields from profile
            user.profile.city = validated_data['city']
            user.profile.country = validated_data['country']
            user.profile.bio = validated_data['bio']
            return user

#updating user profile
class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)

    class Meta:
        model = User
        #, 'city', 'country', 'bio'
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'username': {'required': False},
                        'email': {'required': False},
                        'password': {'required': False},
                        'first_name': {'required': False},
                        'last_name': {'required': False}}


        def validate_email(self, value):
            user = self.context['request'].user
            if User.objects.exclude(pk=user.pk).filter(email=value).exists():
                raise serializers.ValidationError({"email": "This email is already in use."})
            return value

        def validate_username(self, value):
            user = self.context['request'].user
            if User.objects.exclude(pk=user.pk).filter(username=value).exists():
                raise serializers.ValidationError({"username": "This username is already in use."})
            return value

        def update(self, instance, validated_data):
            #re-writing updated profile info from request
            user = self.context['request'].user

            if user.pk != instance.pk:
                raise serializers.ValidationError({"authorize": "You don't have permission for this user."})

            instance.first_name = validated_data['first_name']
            instance.last_name = validated_data['last_name']
            instance.email = validated_data['email']
            instance.username = validated_data['username']
            # instance.profile.city = validated_data['city']
            # instance.profile.country = validated_data['country']
            # instance.profile.bio = validated_data['bio']

            instance.save()

            return instance

#customizing the payload we get from our access tokens
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['country'] = user.profile.country
        token['city'] = user.profile.city
        token['bio'] = user.profile.bio
        token['photo'] = json.dumps(str(user.profile.profile_pic))
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)


class PasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
