from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

#extending user model to include 
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=50,blank=True)
    country = models.CharField(max_length=50, blank=True)
    bio = models.CharField(max_length=500, blank=True)
    def __str__(self):
        return self.user.username
