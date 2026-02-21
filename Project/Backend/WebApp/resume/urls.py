from django.urls import path
from . import views

urlpatterns = [
    path('api/upload/',views.resume_upload_api),
]