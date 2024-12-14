from django.contrib import admin
from .models import User, Profile


# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'phone']


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'gender', 'country']
    list_editable = ['gender', 'country']
    search_fields = ['full_name']
    list_filter = ['gender']


admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
