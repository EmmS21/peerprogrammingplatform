from django.contrib.auth.models import User
# from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers, exceptions

# added more imports based on simpleJWT tutorial
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.contrib.auth import authenticate, user_logged_in, get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
import json
# from rest_auth.serializers import UserDetailsSerializer
from accounts.models import ProgrammingChallenge
from accounts.models import Profile
import logging

logger = logging.getLogger(__name__)
# User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['city', 'country', 'is_online',
                  'currently_active', 'in_waiting_room', 'profile_pic']


# changed from serializers.HyperLinked to ModelSerializer and then to RegisterSerializer to accurately reflect what this does
class RegisterSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password',
                  'first_name', 'last_name', 'profile']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    # password validation

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        user = User.objects.create(**validated_data)
        if profile_data:
            Profile.objects.create(**profile_data, user=user)
        return user

# }

# upload profile picture using base64 encoding string instead of raw file (not supported by default)


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # check if this is base64 string
        if isinstance(data, six.string_types):
            # check if the base64 is in the data format
            if 'data:' in data and ';base64' in data:
                header, data = data.split(';base64,')
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name:
            file_name = str(uuid.uuid4())[:12]
            # Get the file name extension
            file_extension = self.get_file_extension(file_name, decoded_file)
            complete_file_name = "%s.%s" % (file_name, file_extension,)
            data = ContentFile(decoded_file, name=complete_file_name)
        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr
        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension
        return extension


# updating user profile
class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    city = serializers.CharField(
        source='profile.city', allow_blank=True, required=False)
    country = serializers.CharField(
        source='profile.country', allow_blank=True, required=False)
    profile_pic = Base64ImageField(
        source='profile.profile_pic', max_length=None, use_url=True, required=False)
    is_online = serializers.BooleanField(
        source='profile.is_online', required=False)
    currently_active = serializers.BooleanField(
        source='profile.currently_active', required=False)
    is_in_session = serializers.BooleanField(
        source='profile.is_in_session', required=False)
    in_waiting_room = serializers.BooleanField(
        source='profile.in_waiting_room', required=False)

    # serializers.ImageField(source='profile.profile_pic', use_url=True, required=False)

    class Meta:
        model = User
        # , 'city', 'country', 'bio'
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'city', 'country', 'profile_pic',
                  'is_online', 'currently_active', 'is_in_session', 'in_waiting_room']
        # fields = UserDetailsSerializer.Meta.fields + ('city', 'country')
        extra_kwargs = {'username': {'required': False},
                        'email': {'required': False},
                        'password': {'required': False},
                        'first_name': {'required': False},
                        'last_name': {'required': False},
                        'city': {'required': False},
                        'country': {'required': False},
                        'profile_pic': {'required': False},
                        'is_online': {'required': False},
                        'currently_active': {'required': False},
                        'is_in_session': {'required': False},
                        'in_waiting_room': {'required': False},
                        }

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        city = profile_data.get('city')
        country = profile_data.get('country')
        profile_pic = profile_data.get('profile_pic')
        is_online = profile_data.get('is_online')
        currently_active = profile_data.get('currently_active')
        is_in_session = profile_data.get('is_in_session')
        in_waiting_room = profile_data.get('in_waiting_room')

        instance = super(UpdateUserSerializer, self).update(
            instance, validated_data)

        profile = instance.profile
        if profile_data:
            if city:
                profile.city = city
            if country:
                profile.country = country
            if profile_pic:
                profile.profile_pic = profile_pic
            if is_online is not None:
                profile.is_online = is_online
            if currently_active is not None:
                profile.currently_active = currently_active
            if is_in_session is not None:
                profile.is_in_session = is_in_session
            if in_waiting_room is not None:
                profile.in_waiting_room = in_waiting_room
            profile.save()
        return instance


# customizing the payload we get from our access tokens
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            "password": attrs["password"],
        }
        try:
            authenticate_kwargs["request"] = self.context["request"]
        except KeyError:
            pass
        user = authenticate(**authenticate_kwargs)
        print('user', user)
        print('authenticate_kwargs:', authenticate_kwargs)
        if not user:
            return {
                'user': 'Username or password is incorrect',
            }
        token = RefreshToken.for_user(user)
        token['username'] = user.get_username()
        logger.debug(f"User Pair: {user}")
        token_data = {
            'refresh': str(token),
            'access': str(token.access_token),
        }
        user_logged_in.send(sender=user.__class__,
                            request=self.context['request'], user=user)

        if not api_settings.USER_AUTHENTICATION_RULE(user):
            raise exceptions.AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )
        return {
            'refresh': token_data['refresh'],
            'access': token_data['access'],
        }


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Check if the user is correctly authenticated
        if response.status_code == 200:
            user = request.user
            if user.is_authenticated:
                logger.debug(f"User {user.username} is authenticated.")
                print('user', user)
            else:
                logger.debug("User is not authenticated.")
        else:
            logger.debug("Token obtain failed.")

        return response


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


class ProgrammingChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgrammingChallenge
        fields = '__all__'
        # def create(self, validated_data):
        #     return ProgrammingChallenges.create(**validated_data)
