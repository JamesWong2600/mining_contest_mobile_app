from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.cache import cache
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.files import File
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models import Q 
from .models import User
from .models import Signup_list
from .models import Recent_activities
from .models import Ranking
from django.http import JsonResponse
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Forum
from datetime import datetime


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
            '/api/token/',
            '/api/token/refresh/',
         ]
    return Response(routes)

@csrf_exempt
def index(request):
    return HttpResponse("Hello, world. You're at the index.")

@csrf_exempt
def signup_list(request):
    if request.method == 'GET':
        try:
            # Get user data and return signup list information
            """return JsonResponse({
                'signupList': [
                    {'id': 1, 'title': 'minecraft新春挖礦大賽', 'date': '2025-4-19', 'status': '已結束', 'prize': '$HKD2000' },
                    {'id': 2, 'title': 'minecraft春季挖礦小賽', 'date': '2025-4-19', 'status': '已結束', 'prize': '$HKD600' },
                    {'id': 3, 'title': 'minecraft夏季挖礦大賽', 'date': '2025-4-19', 'status': '未開放', 'prize': '待定' },
                    {'id': 4, 'title': 'minecraft秋季挖礦大賽', 'date': '2025-4-19', 'status': '未開放', 'prize': '待定' },
                ]
            })"""
        
            signups = Signup_list.objects.all().order_by('-id')  # The minus sign indicates descending order
            
            # Convert queryset to list of dictionaries
            signup_list = [
                {
                    'id': signup.id,
                    'title': signup.title,
                    'date': signup.date,
                    'status': signup.status,
                    'prize': signup.prize
                } for signup in signups
            ]
            
            return JsonResponse({'signupList': signup_list})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def dashboard(request):
    if request.method == 'GET':
        try:
            # Get user data and return dashboard information
            activities = Recent_activities.objects.all().order_by('-id')  # The minus sign indicates descending order
            
            # Convert queryset to list of dictionaries
            recent_activities_list = [
                {
                    'id': activity.id,
                    'title': activity.title,
                    'date': activity.date,
                } for activity in activities
            ]
            
            return JsonResponse({'activities': recent_activities_list})
        
            return JsonResponse({
                'balance': '1000.00',
                'contestsCount': 5,
                'activities': [
                    {'id': 1, 'text': 'minecraft勝出者:duck9401', 'time': '2025-4-19'},
                    {'id': 2, 'text': 'minecraft春季挖礦小賽', 'time': '2025-4-19'},
                    {'id': 3, 'text': 'minecraft勝出者:fkw_hk', 'time': '2025-1-31'},
                    {'id': 4, 'text': 'minecraft新春挖礦大賽', 'time': '2025-1-31'},
                ]
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def ranking(request):
    if request.method == 'GET':
        try:
            # Get user data and return dashboard information
            ranking = Ranking.objects.all().order_by('unique_rank_id')  # The minus sign indicates descending order
            
            # Convert queryset to list of dictionaries
            ranking_list = [
                {
                    'unique_rank_id': rank.unique_rank_id,
                    'player': rank.player,
                    'uuid': rank.uuid,
                    'point': rank.point,
                } for rank in ranking
            ]
            print(ranking_list)
            
            return JsonResponse({'rankingList': ranking_list})
        
            return JsonResponse({
                'balance': '1000.00',
                'contestsCount': 5,
                'activities': [
                    {'id': 1, 'text': 'minecraft勝出者:duck9401', 'time': '2025-4-19'},
                    {'id': 2, 'text': 'minecraft春季挖礦小賽', 'time': '2025-4-19'},
                    {'id': 3, 'text': 'minecraft勝出者:fkw_hk', 'time': '2025-1-31'},
                    {'id': 4, 'text': 'minecraft新春挖礦大賽', 'time': '2025-1-31'},
                ]
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        print("ok")
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        print(f"Username: {username}, Password: {password}")
        if not username or not password:
            return JsonResponse({"error": "All fields are required."}, status=400)
        try:
            user = User.objects.get(Q(username=username) & Q(password=password))
            print(user)
            if user:
                return JsonResponse({"message": "Login successful."})
        except ObjectDoesNotExist:
            return JsonResponse({"error": "User not exists."}, status=400)



@csrf_exempt
def register(request):
    if request.method == 'POST':
        print("okkk")
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        print(f"Username: {username}, Email: {email}, Password: {password}")

        # Validate input
        if not username or not email or not password:
            return JsonResponse({"error": "All fields are required."}, status=400)

        # Check if user already exists
        try:
            user = User.objects.get(Q(username=username) | Q(email=email))
            return JsonResponse({"error": "User already exists."}, status=400)
        except ObjectDoesNotExist:
            pass

        # Create new user
        user = User(username=username, email=email, password=password)
        user.save()
    return JsonResponse({"message": "Registration successful."})

@csrf_exempt
def forum(request):
    if request.method == 'GET':
        try:
            # Get user data and return signup list information
            """return JsonResponse({
                'signupList': [
                    {'id': 1, 'title': 'minecraft新春挖礦大賽', 'date': '2025-4-19', 'status': '已結束', 'prize': '$HKD2000' },
                    {'id': 2, 'title': 'minecraft春季挖礦小賽', 'date': '2025-4-19', 'status': '已結束', 'prize': '$HKD600' },
                    {'id': 3, 'title': 'minecraft夏季挖礦大賽', 'date': '2025-4-19', 'status': '未開放', 'prize': '待定' },
                    {'id': 4, 'title': 'minecraft秋季挖礦大賽', 'date': '2025-4-19', 'status': '未開放', 'prize': '待定' },
                ]
            })"""
        
            messages = Forum.objects.all().order_by('-date')  # The minus sign indicates descending order
            
            # Convert queryset to list of dictionaries
            messages_list = [
                {
                    'id': message.id,
                    'username': message.username,
                    'date': message.date,
                    'content': message.content,
                } for message in messages
            ]
            
            return JsonResponse({'messages_list': messages_list})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def forum_send_message(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            content = data.get('content')
            now = datetime.now()
            date = now.strftime('%Y-%m-%d-%H:%M:%S')
            print(f"Username: {username}, Content: {content}, Date: {date}")
            # Validate input
            if not username or not date or not content:
                return JsonResponse({'error': 'All fields are required.'}, status=400)

            # Create and save new Forum message
            message = Forum(username=username, date=date, content=content)
            message.save()

            return JsonResponse({'message': 'Message sent successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def forum_delete_message(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            date = data.get('date')
            print(f"Date: {date}")
            # Validate input
            if not date:
                return JsonResponse({'error': 'Date is required.'}, status=400)

            # Delete Forum message(s) where date matches
            deleted_count, _ = Forum.objects.filter(date=date).delete()

            if deleted_count == 0:
                return JsonResponse({'error': 'No message found to delete.'}, status=404)

            return JsonResponse({'message': 'Message deleted successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)