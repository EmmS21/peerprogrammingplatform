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



# class CustomerUser(AbstractUser):
#     email = models.EmailField("email address", unique=True)
#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = ["username"]
#     city = models.CharField(max_length=50,blank=True)
#     country = models.CharField(max_length=50, blank=True)
#     bio = models.CharField(max_length=500, blank=True)
#     def __str__(self):
#         return self.user.username
