from django.db import models
from django.db.models.signals import post_save
from django.utils.text import slugify
from shortuuid.django_fields import ShortUUIDField
from django.dispatch import receiver
# Create your models here.

from app_auth.models import User, Profile
from app_vendor.models import Vendor


class Category(models.Model):
    title = models.CharField(max_length=100)
    image = models.FileField(upload_to='category', default='category.jpg', null=True, blank=True)
    active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'category'
        ordering = ['-title']


class Product(models.Model):
    STATUS = (
        ('draft', 'Draft'),
        ('disabled', 'Disabled'),
        ('in_review', 'In review'),
        ('published', 'Published'),
    )
    title = models.CharField(max_length=100)
    image = models.FileField(upload_to='products', default='product.jpg', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=12)
    old_price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    stock_qty = models.PositiveIntegerField(default=1)
    in_stock = models.BooleanField(default=True)
    status = models.CharField(max_length=100, choices=STATUS, default='published')
    featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    pid = ShortUUIDField(unique=True, length=10, alphabet='absdefg12345')
    slug = models.SlugField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    # Calculates the average rating of the product
    def product_rating(self):
        product_rating = Review.objects.filter(product=self).aggregate(avg_rating=models.Avg('rating'))
        return product_rating['avg_rating']

    def rating_count(self):
        rating_count = Review.objects.filter(product=self).count()
        return rating_count

    def gallery(self):
        return Gallery.objects.filter(product=self)

    def specification(self):
        return Specification.objects.filter(product=self)

    def size(self):
        return Size.objects.filter(product=self)

    def color(self):
        return Color.objects.filter(product=self)

    def orders(self):
        return CartOrderItems.objects.filter(product=self).count()

    # def save(self, *args, **kwargs):
    #     self.rating = self.product_rating()
    #     super(Product, self).save(*args, **kwargs)

    def save(self, *args, **kwargs):
        self.rating = self.product_rating()
        if self.slug == '' or self.slug == None:
            self.slug = slugify(self.title)
        super(Product, self).save(*args, **kwargs)


class Gallery(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.FileField(upload_to='products', default='product.jpg', null=True, blank=True)
    active = models.BooleanField(default=True)
    gid = ShortUUIDField(unique=True, length=10, alphabet='abcdef12345')

    def __str__(self):
        return self.product.title

    class Meta:
        verbose_name_plural = 'Product images'


class Specification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=1000, null=True, blank=True)
    content = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.title


class Size(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=1000, null=True, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=12, default=0.00, null=True, blank=True)

    def __str__(self):
        return self.name


class Color(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    color_code = models.CharField(max_length=100, blank=True, null=True)
    image = models.FileField(upload_to='user_directory_path', blank=True, null=True)

    def __str__(self):
        return self.name


class Cart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    qty = models.PositiveIntegerField(default=0)
    price = models.DecimalField(default=0.00, decimal_places=2, max_digits=12)
    sub_total = models.DecimalField(default=0.00, decimal_places=2, max_digits=12)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    tax_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    service_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    country = models.CharField(max_length=100, null=True, blank=True)
    size = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)
    cart_id = models.CharField(max_length=1000, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cart_id} - {self.product.title}"


class CartOrder(models.Model):
    PAYMENT_STATUS = (
        ('paid', 'Paid'),
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('cancelled', 'Cancelled'),
    )
    ORDER_STATUS = (
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
        ('cancelled', 'Cancelled'),
    )
    vendor = models.ManyToManyField(Vendor, blank=True)
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    sub_total = models.DecimalField(default=0.00, decimal_places=2, max_digits=12)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    tax_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    service_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    payment_status = models.CharField(choices=PAYMENT_STATUS, max_length=100, default='pending')
    order_status = models.CharField(choices=ORDER_STATUS, max_length=100, default='pending')

    full_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    mobile = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    stripe_session_id = models.CharField(max_length=1000, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    oid = ShortUUIDField(unique=True, length=10, alphabet='abcdef12345')
    date = models.DateTimeField(auto_now_add=True)
    # For Coupons
    initial_total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    saved = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    def __str__(self):
        return self.oid

    def order_item(self):
        return CartOrderItems.objects.filter(order=self)


class CartOrderItems(models.Model):
    order = models.ForeignKey(CartOrder, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(default=0)
    price = models.DecimalField(default=0.00, decimal_places=2, max_digits=12)
    sub_total = models.DecimalField(default=0.00, decimal_places=2, max_digits=12)
    shipping_amount = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    tax_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    service_fee = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    country = models.CharField(max_length=100, null=True, blank=True)
    size = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)
    oid = ShortUUIDField(unique=True, length=10, alphabet='abcdef12345')
    date = models.DateTimeField(auto_now_add=True)
    # For Coupons
    coupon = models.ManyToManyField("Coupon", blank=True)
    initial_total = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)
    saved = models.DecimalField(decimal_places=2, max_digits=12, default=0.00)

    def __str__(self):
        return self.oid

    class Meta:
        verbose_name_plural = 'Car Order Items'


class ProductFaq(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    email = models.EmailField(null=True, blank=True)
    question = models.CharField(max_length=2000)
    answer = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question

    class Meta:
        verbose_name_plural = 'Product FAQs'


class Review(models.Model):
    RATING = (
        (1, '1 star'),
        (2, '2 star'),
        (3, '3 star'),
        (4, '4 star'),
        (5, '5 star'),
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    review = models.TextField()
    reply = models.TextField(null=True, blank=True)
    rating = models.IntegerField(default=None, choices=RATING)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.title

    class Meta:
        verbose_name_plural = 'Product reviews & rating'

    def profile(self):
        return Profile.objects.get(user=self.user)


@receiver(post_save, sender=Review)
def update_product_rating(sender, instance, **kwargs):
    if instance.product:
        instance.product.save()


class Whishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.title


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(CartOrder, on_delete=models.SET_NULL, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    order_item = models.ForeignKey(CartOrderItems, on_delete=models.SET_NULL, null=True, blank=True)
    seen = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.order:
            return self.order.oid
        else:
            return f'Notification - {self.pk}'


class Coupon(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    user_by = models.ManyToManyField(User, blank=True)
    code = models.CharField(max_length=100)
    discount = models.IntegerField(default=1)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


class Tax(models.Model):
    country = models.CharField(max_length=100)
    rate = models.IntegerField(default=5, help_text="Entered number is consider as percentage")
    active = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.country

    class Meta:
        verbose_name_plural = 'Taxes'
        ordering = ['country']


class Wishlist(models.Model):
    # A foreign key relationship to the User model with CASCADE deletion
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    # A foreign key relationship to the Product model with CASCADE deletion, specifying a related name
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="wishlist")
    # Date and time field
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Wishlist"

    # Method to return a string representation of the object
    def __str__(self):
        if self.product.title:
            return self.product.title
        else:
            return "Wishlist"
