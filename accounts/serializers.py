from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ('user_id', 'fullname', 'location', 'email', 'signup_confirmation')
