"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views
from app.api import HelloWorld
from rest_framework_simplejwt.views import (TokenRefreshView)
from app.views import MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('signup_list/', views.signup_list, name='signup_list'),
    path('ranking/', views.ranking, name='ranking'),
    path('api/hello/', HelloWorld.as_view()),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('forum/', views.forum, name='forum'),
    path('forum_send_message/', views.forum_send_message, name='forum_send_message'),
    path('forum_delete_message/', views.forum_delete_message, name='forum_delete_message'),
]
