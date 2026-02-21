from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    ROLE_CHOICES=[
        ('python_dev','Python Developer'),
        ('data_analyst',"Data Analyst"),
        ('frontend_dev','Frontend Developer'),
        ('backend_dev','backend Developer'),
        ('fullstack_dev', 'Full Stack Developer'),
        ('devops_engine', 'DevOps Engineer'),
        ('java_dev', 'Java Developer')
    ]
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    file=models.FileField(upload_to='resumes/')
    job_role=models.TextField(max_length=50,choices=ROLE_CHOICES)
    score=models.IntegerField(default=0)
    matched_keywords=models.TextField(blank=True,null=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.job_role}"

