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
from .models import Feedback
from django.http import JsonResponse
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Forum
from .models import ReportUpload
from datetime import datetime
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os

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

@csrf_exempt
def report_upload(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        username = request.POST.get('username', '')
        print(f"Username: {username}")
        print("FILES:", request.FILES)
        print(file)
        description = request.POST.get('description', '')
        now = datetime.now()
        date = now.strftime('%Y-%m-%d-%H:%M:%S')
        if not file:
            return JsonResponse({'error': 'No file provided.'}, status=400)

        # Save file to media/report_videos/
        save_path = os.path.join('report_videos', file.name)
        path = default_storage.save(save_path, ContentFile(file.read()))

        # (Optional) Save to DB if you have a model
        ReportUpload.objects.create(file=path, description=description, username=username, uploaded_at=date)

        return JsonResponse({'message': 'File uploaded successfully.', 'file_url': default_storage.url(path)})
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def feedback_submit(request):
    if request.method == 'POST':
        #data = json.loads(request.body)
        #feedback_title = data.get('title')
        #feedback_content = data.get('description')
        feedback_title = request.POST.get('title', '')
        feedback_content = request.POST.get('description', '')
        usertitle = request.POST.get('username', '')
        now = datetime.now()
        date = now.strftime('%Y-%m-%d-%H:%M:%S')
        print(f"Feedback Title: {feedback_title}, Feedback Content: {feedback_content}")
        Feedback.objects.create(feedback_title=feedback_title, feedback_content=feedback_content, username=usertitle, created_at=date)

        return JsonResponse({'message': 'File uploaded successfully.'})
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def feedback_list(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username', '')
            print(f"Username: {username}")
            # Get user data and return signup list information
            """return JsonResponse({
                'signupList': [
                    {'id': 1, 'title': 'minecraft新春挖礦大賽', 'date': '2025-4-19', 'status': '已結束', 'prize': '$HKD2000' },
                    {'id': 2, 'title': 'minecraft春季挖礦小賽', 'date': '2025-4-19', 'status': '已結束', 'prize': '$HKD600' },
                    {'id': 3, 'title': 'minecraft夏季挖礦大賽', 'date': '2025-4-19', 'status': '未開放', 'prize': '待定' },
                    {'id': 4, 'title': 'minecraft秋季挖礦大賽', 'date': '2025-4-19', 'status': '未開放', 'prize': '待定' },
                ]
            })"""
        
            feedbacks = Feedback.objects.filter(username=username).order_by('-created_at') # The minus sign indicates descending order
            
            # Convert queryset to list of dictionaries
            feedback_list = [
                {
                    'id': feedback.id,
                    'feedback_title': feedback.feedback_title,
                    'feedback_content': feedback.feedback_content,
                    'created_at': feedback.created_at,
                } for feedback in feedbacks
            ]
            
            return JsonResponse({'feedbackList': feedback_list})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def feedback_delete(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            date = data.get('date')
            print(f"Feedback ID: {date}")
            # Validate input
            if not date:
                return JsonResponse({'error': 'ID is required.'}, status=400)

            # Delete Feedback message(s) where id matches
            deleted_count, _ = Feedback.objects.filter(created_at=date).delete()

            if deleted_count == 0:
                return JsonResponse({'error': 'No message found to delete.'}, status=404)

            return JsonResponse({'message': 'Message deleted successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)



@csrf_exempt
def feedback_content(request):
    if request.method == 'POST':
        try:
            content_date = request.POST.get('date', '')
            username = request.POST.get('username', '')
            print(f"Feedback ID: {content_date}, Username: {username}")
            # Validate input
            if not content_date:
                return JsonResponse({'error': 'ID is required.'}, status=400)

            # Get Feedback message(s) where id matches
            contents = Feedback.objects.filter(created_at=content_date, username=username)

            content_list = [
                {
                    'id': content.id,
                    'feedback_title': content.feedback_title,
                    'username': content.username,
                    'feedback_content': content.feedback_content,
                    'created_at': content.created_at,
                } for content in contents
            ]
            print(content_list)

            if not content_list:
                return JsonResponse({'error': 'No message found to delete.'}, status=404)

            return JsonResponse({'content': content_list})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def report_list(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username', '')
            print(f"Username: {username}")
            # Get user data and return signup list information
        
            reports = ReportUpload.objects.filter(username=username).order_by('-uploaded_at') # The minus sign indicates descending order
            
            # Convert queryset to list of dictionaries
            report_list = [
                {
                    'id': report.id,
                    'uploaded_at': report.uploaded_at,
                } for report in reports
            ]

            print(report_list)
            
            return JsonResponse({'report': report_list})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)
        

@csrf_exempt
def report_delete(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            date = data.get('date')
            print(f"Feedback ID: {date}")
            # Validate input
            if not date:
                return JsonResponse({'error': 'ID is required.'}, status=400)

            # Delete Feedback message(s) where id matches
            deleted_count, _ = ReportUpload.objects.filter(created_at=date).delete()

            if deleted_count == 0:
                return JsonResponse({'error': 'No message found to delete.'}, status=404)

            return JsonResponse({'message': 'Message deleted successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def report_content(request):
    if request.method == 'POST':
        try:
            report_date = request.POST.get('date', '')
            username = request.POST.get('username', '')
            print(f"Feedback ID: {report_date}, Username: {username}")
            # Validate input
            if not report_date:
                return JsonResponse({'error': 'ID is required.'}, status=400)

            # Get Feedback message(s) where id matches
            reports = ReportUpload.objects.filter(uploaded_at=report_date, username=username)

            report_list = [
                {
                    'id': report.id,
                    'username': report.username,
                    'file': request.build_absolute_uri(report.file.url),
                    'uploaded_at': report.uploaded_at,
                } for report in reports
            ]

            
            print(report_list)

            if not report_list:
                return JsonResponse({'error': 'No message found to delete.'}, status=404)

            return JsonResponse({'report_list': report_list})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)