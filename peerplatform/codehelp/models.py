from django.db import models
from django.contrib.auth.models import User
class UserQuestionRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question_id = models.IntegerField()  # ID or reference to the Leetcode question
    request_count = models.IntegerField(default=0)