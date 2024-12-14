import json

from django.db import transaction
from django.db.models import Sum, F, Count
from django.db.models.functions import ExtractMonth
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.decorators import api_view

from app_auth.models import User, Profile
from app_auth.serializers import ProfileSerializer
# Create your views here.
from app_store.models import Category, Product, Cart, Tax, CartOrder, CartOrderItems, Coupon, Notification, Review, \
    Wishlist
from app_store.serializers import ProductSerializer, SummarySerializer, CategorySerializer, CartSerializer, \
    CartOrderSerializer, \
    CouponSerializer, \
    NotificationSerializer, ReviewSerializer, WishlistSerializer, CartOrderItemsSerializer, EarningSerializer, \
    CouponSummarySerializer, NotificationSummarySerializer, VendorSerializer, ColorSerializer, SizeSerializer, \
    GallerySerializer, SpecificationSerializer

from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from decimal import Decimal
import stripe
from datetime import datetime, timedelta

from app_vendor.models import Vendor


class DashboardStatsAPIView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = SummarySerializer

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        product_count = Product.objects.filter(vendor=vendor).count()
        order_count = CartOrder.objects.filter(vendor=vendor, payment_status='paid').count()
        revenue = CartOrderItems.objects.filter(vendor=vendor, order__payment_status='paid').aggregate(
            total_revenue=Sum(F('sub_total') + F('shipping_amount')))['total_revenue'] or 0

        return [{
            'products': product_count,
            'orders': order_count,
            'revenue': revenue,
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def monthly_orders_chart_apiview(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    orders = CartOrder.objects.filter(vendor=vendor, payment_status='paid')
    orders_by_month = orders.annotate(month=ExtractMonth('date')).values('month').annotate(orders=Count('id')).order_by(
        'month')
    print("orders_by_month====", orders_by_month)
    return Response(orders_by_month)


@api_view(['GET'])
def monthly_products_chart_apiview(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    products = Product.objects.filter(vendor=vendor)
    products_by_month = products.annotate(month=ExtractMonth('date')).values('month').annotate(
        products=Count('id')).order_by(
        'month')
    print('products_by_month====', products_by_month)
    return Response(products_by_month)


class ProductAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Product.objects.filter(vendor=vendor).order_by('-id')


class OrderAPIView(generics.ListAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return CartOrder.objects.filter(vendor=vendor, payment_status='paid').order_by('-id')


class OrderDetailAPiView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        order_oid = self.kwargs['order_oid']
        vendor = Vendor.objects.get(id=vendor_id)
        return CartOrder.objects.get(vendor=vendor, oid=order_oid)


class FilterOrderAPIView(generics.ListAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self, *args, **kwargs):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        filter = self.request.GET.get('filter')

        if filter == 'paid':
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='paid').order_by('-id')
        elif filter == 'pending':
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='pending').order_by('-id')
        elif filter == 'processing':
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='processing').order_by('-id')
        elif filter == 'cancelled':
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='cancelled').order_by('-id')
        elif filter == 'latest':
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='paid').order_by('-id')
        elif filter == 'oldest':
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='paid').order_by('id')
        elif filter == 'Pending':
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='paid', order_status='pending').order_by(
                '-id')
        elif filter == 'fulfilled':
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='paid', order_status='pending').order_by(
                '-id')
        elif filter == 'cancelled':
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='paid', order_status='cancelled').order_by(
                '-id')
        else:
            orders = CartOrder.objects.filter(vendor=vendor, payment_status='paid').order_by('-id')

        return orders


class RevenueAPIView(generics.ListAPIView):
    serializer_class = CartOrderItemsSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return CartOrderItems.objects.filter(vendor=vendor, order__payment_status='paid').aggregate(
            total_revenue=Sum(F('sub_total') + F('shipping_amount')))['total_revenue'] or 0


class FilterProduuctAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        filter = self.request.GET.get('filter')

        if filter == 'published':
            products = Product.object.filter(vendor=vendor, status='published')
        elif filter == 'in_review':
            products = Product.object.filter(vendor=vendor, status='in_review')
        elif filter == 'draft':
            products = Product.object.filter(vendor=vendor, status='draft')
        elif filter == 'disabled':
            products = Product.object.filter(vendor=vendor, status='disabled')
        else:
            products = Product.object.filter(vendor=vendor)

        return products


class EarningAPIView(generics.ListAPIView):
    serializer_class = EarningSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        one_month_ago = datetime.today() - timedelta(days=28)
        monthly_revenue = \
            CartOrderItems.objects.filter(vendor=vendor, order__payment_status='paid',
                                          date__gte=one_month_ago).aggregate(
                total_revenue=Sum(F('sub_total') + F('shipping_amount')))['total_revenue'] or 0
        total_revenue = \
            CartOrderItems.objects.filter(vendor=vendor, order__payment_status='paid').aggregate(
                total_revenue=Sum(F('sub_total') + F('shipping_amount')))['total_revenue'] or 0

        return [{
            'monthly_revenue': monthly_revenue,
            'total_revenue': total_revenue,
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def monthly_earning_tracker(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    monthly_earning_tracker = (
        CartOrderItems.objects
        .filter(vendor=vendor, order__payment_status='paid')
        .annotate(month=ExtractMonth('date'))
        .values('month')
        .annotate(
            sales_count=Sum('qty'),
            total_earning=Sum(F('sub_total') + F('shipping_amount'))
        )
        .order_by('-month')
    )
    # json_data=json.dumps(monthly_earning_tracker)
    print('monthly_earning_tracker====', monthly_earning_tracker)

    return Response(monthly_earning_tracker)


class ReviewListAPIView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Review.objects.filter(product__vendor=vendor)


class ReviewDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        review_id = self.kwargs['review_id']
        vendor = Vendor.objects.get(id=vendor_id)
        review = Review.objects.get(id=review_id, product__vendor=vendor)
        return review


class CouponListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CouponSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        print('vendor id coupon = ======', vendor_id)
        vendor = Vendor.objects.get(id=vendor_id)

        return Coupon.objects.filter(vendor=vendor)

    def create(self, request, *args, **kwargs):
        payload = request.data

        vendor_id = payload['vendor_id']
        code = payload['code']
        discount = payload['discount']
        active = payload['active']
        print('payload ======', payload)
        print('code ======', code)
        print('discount ======', discount)
        print('discount ======', discount)
        print('actives ======', active)

        vendor = Vendor.objects.get(id=vendor_id)
        Coupon.objects.create(
            vendor=vendor,
            code=code,
            discount=discount,
            active=(active.lower() == 'true'))

        return Response({'message': 'Coupon created successfully'}, status=status.HTTP_201_CREATED)


class CouponDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CouponSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        coupon_id = self.kwargs['coupon_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Coupon.objects.get(vendor=vendor, id=coupon_id)


class CouponStatsAPIView(generics.ListAPIView):
    serializer_class = CouponSummarySerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        total_coupons = Coupon.objects.filter(vendor=vendor).count()
        active_coupons = Coupon.objects.filter(vendor=vendor, active=True).count()

        return [{
            'total_coupons': total_coupons,
            'active_coupons': active_coupons
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# class NotificationUnseenAPIView(generics.ListAPIView):
#     serializer_class = NotificationSerializer
#     permission_classes = (AllowAny,)
# 
#     def get_queryset(self):
#         vendor_id = self.kwargs['vendor_id']
#         vendor = Vendor.objects.get(id=vendor_id)
#         return Notification.objects.filter(vendor=vendor, seen=False).order_by('-id')


class NotificationAPIView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Notification.objects.filter(vendor=vendor, seen=False).order_by('-id')


class NotificationSummaryAPIView(generics.ListAPIView):
    serializer_class = NotificationSummarySerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        unread_notif = Notification.objects.filter(vendor=vendor, seen=False).count()
        read_notif = Notification.objects.filter(vendor=vendor, seen=True).count()
        all_notif = Notification.objects.filter(vendor=vendor).count()

        return [{
            'unread_notif': unread_notif,
            'read_notif': read_notif,
            'all_notif': all_notif,
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class NotificationVendorMarkAsSeen(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        notif_id = self.kwargs['notif_id']

        vendor = Vendor.objects.get(id=vendor_id)
        notif = Notification.objects.get(vendor=vendor, id=notif_id)
        notif.seen = True
        notif.save()

        return notif


class VendorProfileUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        print('profile===============', profile)
        return profile


class ShopUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = VendorSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        vendor = Vendor.objects.get(user=user)
        print('Vendor===============', vendor)
        return vendor


class ShopAPIView(generics.RetrieveAPIView):
    serializer_class = VendorSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        vendor_slug = self.kwargs['vendor_slug']
        return Vendor.objects.get(slug=vendor_slug)


class ShopProductAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_slug = self.kwargs['vendor_slug']
        vendor = Vendor.objects.get(slug=vendor_slug)

        products = Product.objects.filter(vendor=vendor)

        return products


class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)
    queryset = Product.objects.all()

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        serializer.save()
        product_instance = serializer.instance

        specifications_data = []
        colors_data = []
        sizes_data = []
        gallery_data = []
        print('request.data ============', self.request.data)
        print('request.data.items ============', self.request.data.items())

        for key, value in request.data.items():
            if key.startwith('specification') and '[title]' in key:
                index = key.split('[')[1].split(']')[0]
                title = value
                content_key = f'specifications[{index}][content]'
                content = self.request.data.get(content_key)
                specifications_data.append({'title': title, 'content': content})

            elif key.startwith('colors') and '[name]' in key:
                index = key.split('[')[1].split(']')[0]
                name = value
                color_code_key = f'colors[{index}][color_code]'
                color_code = self.request.data.get(color_code_key)
                colors_data.append({'name': name, 'color_code': color_code})

            elif key.startwith('sizes') and '[name]' in key:
                index = key.split('[')[1].split(']')[0]
                name = value
                price_key = f'sizes[{index}][price]'
                price = self.request.data.get(price_key)
                sizes_data.append({'name': name, 'price': price})

            elif key.startwith('gallery') and '[image]' in key:
                index = key.split('[')[1].split(']')[0]
                image = value
                gallery_data.append({'image': image})

        print('specification date =====', specifications_data)
        print('color date =====', colors_data)
        print('size date =====', sizes_data)
        print('gallery date =====', gallery_data)
        self.save_nested_data(product_instance, SpecificationSerializer, specifications_data)
        self.save_nested_data(product_instance, ColorSerializer, colors_data)
        self.save_nested_data(product_instance, SizeSerializer, sizes_data)
        self.save_nested_data(product_instance, GallerySerializer, gallery_data)

    def save_nested_data(self, product_instance, serializer_class, data):
        serializer = serializer_class(data=data, many=True, context={'product_instance': product_instance})
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product_instance)


class ProductUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        product_pid = self.kwargs['product_pid']

        vendor = Vendor.objects.get(id=vendor_id)
        product = Product.objects.get(pid=product_pid, vendor=vendor)

        return product

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        product = self.get_object()

        serializer = self.get_serializer(product, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        product.specification().delete()
        product.color().delete()
        product.size().delete()
        product.gallery().delete()

        specifications_data = []
        colors_data = []
        sizes_data = []
        gallery_data = []

        for key, value in request.data.items():
            if key.startwith('specification') and '[title]' in key:
                index = key.split('[')[1].split(']')[0]
                title = value
                content_key = f'specifications[{index}][content]'
                content = self.request.data.get(content_key)
                specifications_data.append({'title': title, 'content': content})

            elif key.startwith('colors') and '[name]' in key:
                index = key.split('[')[1].split(']')[0]
                name = value
                color_code_key = f'colors[{index}][color_code]'
                color_code = self.request.data.get(color_code_key)
                colors_data.append({'name': name, 'color_code': color_code})

            elif key.startwith('sizes') and '[name]' in key:
                index = key.split('[')[1].split(']')[0]
                name = value
                price_key = f'sizes[{index}][price]'
                price = self.request.data.get(price_key)
                sizes_data.append({'name': name, 'price': price})

            elif key.startwith('gallery') and '[image]' in key:
                index = key.split('[')[1].split(']')[0]
                image = value
                gallery_data.append({'image': image})

        print('specification date =====', specifications_data)
        print('color date =====', colors_data)
        print('size date =====', sizes_data)
        print('gallery date =====', gallery_data)
        self.save_nested_data(product, SpecificationSerializer, specifications_data)
        self.save_nested_data(product, ColorSerializer, colors_data)
        self.save_nested_data(product, SizeSerializer, sizes_data)
        self.save_nested_data(product, GallerySerializer, gallery_data)

    def save_nested_data(self, product, serializer_class, data):
        serializer = serializer_class(data=data, many=True, context={'product': product})
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product)


class ProductDeleteAPIView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        product_pid = self.kwargs['product_pid']

        vendor = Vendor.objects.get(id=vendor_id)
        product = Product.objects.get(vendor=vendor, pid=product_pid)

        return  product
