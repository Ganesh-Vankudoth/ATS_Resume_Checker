from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Resume

# Register CustomUser with the role field visible in the Admin UI
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Fields to display in the list view
    list_display = ['username', 'email', 'role', 'is_staff']
    # Add 'role' to the user editing and creation forms
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Resume)