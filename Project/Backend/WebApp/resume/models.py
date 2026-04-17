from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class Resume(models.Model):
    ROLE_CHOICES = [
        ('python_dev', 'Python Developer'),
        ('data_analyst', "Data Analyst"),
        ('frontend_dev', 'Frontend Developer'),
        ('backend_dev', 'Backend Developer'),
        ('fullstack_dev', 'Full Stack Developer'),
        ('devops_engine', 'DevOps Engineer'),
        ('java_dev', 'Java Developer')
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    file = models.FileField(upload_to='resumes/')
    job_role = models.TextField(max_length=50, choices=ROLE_CHOICES)
    score = models.IntegerField(default=0)
    matched_keywords = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        username = self.user.username if self.user else "Anonymous"
        return f"{username} - {self.job_role}"


class CustomUser(AbstractUser):
    # ✅ REMOVED ROLE FIELD COMPLETELY

    # Keep these to avoid Django conflicts
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions",
        blank=True
    )

    def __str__(self):
        return self.username