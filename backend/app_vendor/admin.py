from django.contrib import admin

from app_vendor.models import Vendor

# Register your models here.

class VendorAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'active']


admin.site.register(Vendor, VendorAdmin)

