from django.db import models
from django.contrib.auth.models import User


# class Notifications(models.Model):
#     sender = models.ForeignKey(User, null=True, blank=True,
#                                related_name='sender', on_delete=models.CASCADE)
#     receiver = models.ForeignKey(User, null=True, blank=True,
#                                  related_name='receiver', on_delete=models.CASCADE)
#     status = models.CharField(max_length=264, null=True, blank=True,
#                               default="unread")
#     type_of_notification = models.CharField(max_length=264, null=True, blank=True)

class UserEmail(models.Model):
    email = models.EmailField(max_length=255, unique=True)
    class Meta:
        app_label = 'your_app_name_here'

