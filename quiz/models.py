from django.db import models

# Create your models here.
class Question(models.Model):
    text = models.CharField(max_length=255)  
    options = models.JSONField()           
    correct_option = models.CharField(max_length=1) 

class UserSession(models.Model):
    total_questions = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    incorrect_answers = models.IntegerField(default=0)