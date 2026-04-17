from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Resume


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'is_staff']
    fieldsets = UserAdmin.fieldsets
    add_fieldsets = UserAdmin.add_fieldsets


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Resume)