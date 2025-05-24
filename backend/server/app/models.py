from django.db import models
#from django.contrib.auth.models import AbstractUser
# Create your models here.class User(models.Model):
class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=128)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    role = models.CharField(max_length=10, default='member')

"""class AuthUser(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []"""

class Ranking(models.Model):
    unique_rank_id = models.AutoField(primary_key=True)
    player = models.CharField(max_length=128)
    uuid = models.CharField(max_length=128)
    point = models.IntegerField(default=0)

class Signup_list(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=128)
    date = models.CharField(max_length=128)
    status = models.CharField(max_length=128)
    prize = models.CharField(max_length=128)

class Recent_activities(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=128)
    date = models.CharField(max_length=128)


class Forum(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=128)
    date = models.CharField(max_length=128)
    content = models.CharField(max_length=200)

class ReportUpload(models.Model):
    id = models.AutoField(primary_key=True)
    file = models.FileField(upload_to='report_videos/')
    username = models.CharField(max_length=128)
    description = models.TextField(max_length=128)
    uploaded_at = models.DateTimeField(max_length=128)

class Feedback(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=128)
    feedback_title = models.CharField(max_length=128)
    feedback_content = models.CharField(max_length=1280)
    created_at = models.DateTimeField(max_length=128)