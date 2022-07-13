from django.db import models
from django.contrib.auth.models import User


class Notifications(models.Model):
    sender = models.ForeignKey(User, null=True, blank=True,
                               related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, null=True, blank=True,
                                 related_name='receiver', on_delete=models.CASCADE)
    status = models.CharField(max_length=264, null=True, blank=True,
                              default="unread")
    type_of_notification = models.CharField(max_length=264, null=True, blank=True)
