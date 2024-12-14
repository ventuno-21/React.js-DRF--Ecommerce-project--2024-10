from django.contrib import admin

from app_store.models import Category, Product, Gallery, Size, Specification, Color, Cart, CartOrder, CartOrderItems, \
    ProductFaq, Review, Whishlist, Notification, Coupon, Tax, Wishlist


# Register your models here.

class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 1


class SpecificationInline(admin.TabularInline):
    model = Specification
    extra = 1


class SizeInline(admin.TabularInline):
    model = Size
    extra = 1


class ColorInline(admin.TabularInline):
    model = Color
    extra = 1


class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'shipping_amount', 'stock_qty', 'featured', 'in_stock', 'vendor']
    list_editable = ['price', 'shipping_amount', 'stock_qty', 'featured', 'in_stock']
    list_filter = ['date']
    search_fields = ['title']
    inlines = [GalleryInline, SpecificationInline, SizeInline, ColorInline]


class CartOrderAdmin(admin.ModelAdmin):
    list_display = ['oid', 'full_name', 'total', 'payment_status']


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'title']


admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Cart)
admin.site.register(CartOrder, CartOrderAdmin)
admin.site.register(CartOrderItems)
admin.site.register(ProductFaq)
admin.site.register(Review)
admin.site.register(Notification)
admin.site.register(Coupon)
admin.site.register(Tax)
admin.site.register(Wishlist)
