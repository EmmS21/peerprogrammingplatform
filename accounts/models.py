from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fullname = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=150)
    signup_confirmation = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def update_profile_signal(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()

# #creating programming challenges
# class ProgrammingChallenges(models.Model):
#     challenge_id = models.AutoField(primary_key=True)
#     challenge_name = models.CharField(max_length=200)
#     challenge_description = models.TextField()
#     challenge_expectations = models.TextField()