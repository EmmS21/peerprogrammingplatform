from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver

from django.core.cache import cache
import datetime
from signup import settings


# extending user model to include
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    bio = models.CharField(max_length=500, blank=True)
    profile_pic = models.ImageField(upload_to='profile/%Y/%m/%d',
                                    default='media/placeholder.png',
                                    blank=False,
                                    null=False)
    is_online = models.BooleanField(default=False)

    # @receiver(post_save, sender=User)
    # def create_user_profile(self, instance, created, **kwargs):
    #     if created:
    #         Profile.objects.create(user=instance)
    #
    # @receiver(post_save, sender=User)
    # def save_user_profile(self, instance, **kwargs):
    #     instance.profile.save()


# creating programming challenges
class ProgrammingChallenge(models.Model):
    challenge_id = models.AutoField(primary_key=True)
    challenge_name = models.CharField(max_length=200)
    challenge_description = models.TextField()
    challenge_example_one = models.TextField()
    challenge_example_two = models.TextField()
    challenge_example_three = models.TextField()
