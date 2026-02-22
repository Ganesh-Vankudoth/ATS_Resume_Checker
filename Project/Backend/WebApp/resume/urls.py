from django.urls import path
from . import views

urlpatterns = [
    path('api/upload/',views.resume_upload_api),
    path('api/history/',views.user_history_api),
    path('api/register/', views.register_user, name='register_user'),
    path('api/login/', views.login_user, name='login_user'),
    path('api/logout/', views.logout_user, name='logout_user'),
]