from django.shortcuts import render, redirect
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from app_auth.models import User, Profile
# Create your views here.
from app_store.models import Category, Product, Cart, Tax, CartOrder, CartOrderItems, Coupon, Notification, Review, \
    Wishlist
from app_store.serializers import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, \
    CouponSerializer, \
    NotificationSerializer, ReviewSerializer, WishlistSerializer

from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from decimal import Decimal
import stripe


class OrderAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CartOrderSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        orders = CartOrder.objects.filter(buyer=user, payment_status='paid')
        return orders


class OrderDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = CartOrderSerializer
    lookup_field = 'user_id'

    def get_object(self):
        user_id = self.kwargs['user_id']
        order_oid = self.kwargs['order_oid']

        user = User.objects.get(id=user_id)
        order = CartOrder.objects.get(buyer=user, oid=order_oid, payment_status='paid')
        return order


class WishlistAPIView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        wishlists = Wishlist.objects.filter(user=user)
        return wishlists

    def create(self, request, *args, **kwargs):
        payload = request.data
        product_id = payload['product_id']
        user_id = payload['user_id']
        product = Product.objects.get(id=product_id)
        user = User.objects.get(id=user_id)

        wishlist = Wishlist.objects.filter(product=product, user=user)
        if wishlist:
            wishlist.delete()
            return Response({'message': 'Wishlist deleted successfully'}, status=status.HTTP_200_OK)
        else:
            Wishlist.objects.create(product=product, user=user)
            return Response({'message': 'Added to wishlist'}, status=status.HTTP_201_CREATED)


class CustomerNotificationAPIView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        user = User.objects.get(id=user_id)
        return Notification.objects.filter(user=user, seen=False)


class MarkCustomerNotificationAsSeenAPIView(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        user_id = self.kwargs['user_id']
        notif_id = self.kwargs['notif_id']

        user = User.objects.get(id=user_id)
        notif = Notification.objects.get(id=notif_id, user=user)

        if notif.seen != True:
            notif.seen = True
            notif.save()

        return notif
