from django.contrib.auth import user_logged_in, user_logged_out
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser


# extending user model to include
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    bio = models.CharField(max_length=500, blank=True)
    profile_pic = models.ImageField(upload_to='profile/%Y/%m/%d', default='media/placeholder.png', blank=False,
                                    null=False)
    is_online = models.BooleanField(default=False)
    currently_active = models.BooleanField(default=False)
    is_in_session = models.BooleanField(default=False)

    @receiver(user_logged_in)
    def got_online(sender, user, request, **kwargs):
        user.profile.is_online = True
        user.profile.save()
    #not using this
    @receiver(user_logged_out)
    def got_offline(sender, user, request, **kwargs):
        user.profile.is_online = False
        user.profile.save()

    @receiver(post_save, sender=user)
    def update_profile_signal(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)
        instance.profile.save()


# creating programming challenges
class ProgrammingChallenge(models.Model):
    challenge_id = models.AutoField(primary_key=True)
    challenge_name = models.CharField(max_length=200)
    challenge_description = models.TextField()
    challenge_example_one = models.TextField()
    challenge_example_two = models.TextField()
    challenge_example_three = models.TextField()
