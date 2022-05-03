from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser

#extending user model to include
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=50,blank=True)
    country = models.CharField(max_length=50, blank=True)
    bio = models.CharField(max_length=500, blank=True)
    profile_pic = models.ImageField(upload_to='profile/%Y/%m/%d', default='media/placeholder.png', blank=False, null=False)
    # def __str__(self):
    #     return self.user.username
    #we are hooking create_user_profile and save_user profile methods to the User model whenever a save event occurs. This kind of signal is called post_save
    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()

#creating programming challenges
class ProgrammingChallenge(models.Model):
    challenge_id = models.AutoField(primary_key=True)
    challenge_name = models.CharField(max_length=200)
    challenge_description = models.TextField()
    challenge_example_one = models.TextField()
    challenge_example_two = models.TextField()
    challenge_example_three = models.TextField()
