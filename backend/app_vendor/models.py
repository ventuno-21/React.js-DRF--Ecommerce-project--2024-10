from django.db import models

from app_auth.models import User
from django.utils.text import slugify


# Create your models here.

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to='vendor', default='vendor.jpg', blank=True, null=True)
    name = models.CharField(max_length=100, help_text="shop name", blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    mobile = models.CharField(max_length=100, help_text="shop mobile number", blank=True, null=True)
    active = models.BooleanField(default=False)
    email = models.CharField(max_length=100, help_text='Shop email',null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True, max_length=500)

    class meta:
        verbose_name_plural = 'vendors'
        ordering = ['-date']

    def __str__(self):
        return str(self.name)

    def save(self, *args, **kwargs):
        if self.slug == '' or self.slug == None:
            self.slug = slugify(self.name)
        super(Vendor, self).save()
