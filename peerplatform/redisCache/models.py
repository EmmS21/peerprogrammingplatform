from django.db import models

# Create your models here.
class Counter(models.Model):
    counter = models.AutoField(primary_key=True)
    user_name = models.TextField()
