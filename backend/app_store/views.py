from django.shortcuts import render, redirect
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from app_auth.models import User
# Create your views here.
from .models import Category, Product, Cart, Tax, CartOrder, CartOrderItems, Coupon, Notification, Review
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CouponSerializer, \
    NotificationSerializer, ReviewSerializer

from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from decimal import Decimal
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


class CategortListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs['slug']
        return Product.objects.get(slug=slug)


class CartAPIView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data
        print(request)
        print(payload)
        product_id = payload['product_id']
        user_id = payload['user_id']
        qty = payload['qty']
        price = payload['price']
        shipping_amount = payload['shipping_amount']
        country = payload['country']
        size = payload['size']
        color = payload['color']
        cart_id = payload['cart_id']

        product = Product.objects.filter(id=product_id).first()

        if user_id != "undefined":
            user = User.objects.get(id=user_id)
        else:
            user = None

        tax = Tax.objects.filter(country=country).first()
        if tax:
            tax_rate = tax.rate / 100
        else:
            tax_rate = 0

        service_fee_percentage = 0.1

        cart = Cart.objects.filter(cart_id=cart_id, product=product).first()

        print('$' * 50)
        print(cart)
        print('$' * 50)

        if cart:
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price) * int(qty)
            cart.shipping_amount = Decimal(shipping_amount) * int(qty)
            cart.tax_fee = int(qty) * Decimal(tax_rate)
            cart.size = size
            cart.country = country
            cart.color = color
            cart.cart_id = cart_id
            cart.service_fee = Decimal(service_fee_percentage) * Decimal(cart.sub_total)
            cart.total = cart.sub_total + cart.shipping_amount + cart.tax_fee + cart.service_fee
            cart.save()

            return Response({'message': ' Cart updated successfully'}, status=status.HTTP_200_OK)
        else:

            cart = Cart()
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price) * int(qty)
            cart.shipping_amount = Decimal(shipping_amount) * int(qty)
            cart.tax_fee = int(qty) * Decimal(tax_rate)
            cart.size = size
            cart.country = country
            cart.color = color
            cart.cart_id = cart_id
            cart.service_fee = Decimal(service_fee_percentage) * Decimal(cart.sub_total)
            cart.total = cart.sub_total + cart.shipping_amount + cart.tax_fee + cart.service_fee
            cart.save()
            return Response({'message': ' Cart created successfully'}, status=status.HTTP_201_CREATED)


class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    # queryset = Cart.objects.all()

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            user = User.objects.filter(id=user_id).first()
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)
        return queryset


class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    lookup_field = 'cart_id'

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            user = User.objects.filter(id=user_id).first()
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        total_shipping = 0.0
        total_tax = 0.0
        total_service_fee = 0.0
        total_sub = 0.0
        total_total = 0.0

        for cart_item in queryset:
            total_shipping += float(self.calculate_shipping(cart_item))
            total_tax += float(self.calculate_tax(cart_item))
            total_service_fee += float(self.calculate_service_fee(cart_item))
            total_sub += float(self.calculate_sub_total(cart_item))
            total_total += float(self.calculate_total(cart_item))

        data = {
            'shipping': total_shipping,
            'tax': total_tax,
            'service_fee': total_service_fee,
            'sub_total': total_sub,
            'total': total_total,
        }

        return Response(data)

    def calculate_shipping(self, cart_item):
        return cart_item.shipping_amount

    def calculate_tax(self, cart_item):
        return cart_item.tax_fee

    def calculate_service_fee(self, cart_item):
        return cart_item.service_fee

    def calculate_sub_total(self, cart_item):
        return cart_item.sub_total

    def calculate_total(self, cart_item):
        return cart_item.total


class CartItemDeleteAPIView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = 'cart_id'

    def get_object(self):
        cart_id = self.kwargs['cart_id']
        item_id = self.kwargs['item_id']
        user_id = self.kwargs.get('user_id')

        if user_id:
            user = User.objects.get(id=user_id)
            cart = Cart.objects.get(id=item_id, cart_id=cart_id, user=user)
        else:
            cart = Cart.objects.get(id=item_id, cart_id=cart_id)

        return cart


class CreateOrderAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        payload = request.data

        full_name = payload['full_name']
        email = payload['email']
        mobile = payload['mobile']
        address = payload['address']
        city = payload['city']
        state = payload['state']
        country = payload['country']
        cart_id = payload['cart_id']
        user_id = payload['user_id']
        print(user_id)

        order = CartOrder.objects.create(
            full_name=full_name,
            email=email,
            mobile=mobile,
            address=address,
            city=city,
            state=state,
            country=country,
        )

        if user_id == "null":
            user = None
        else:
            user = User.objects.get(id=user_id)
            order.buyer = user

        cart_items = Cart.objects.filter(cart_id=cart_id)

        total_shipping = Decimal(0.00)
        total_tax = Decimal(0.00)
        total_service_fee = Decimal(0.00)
        total_sub_total = Decimal(0.00)
        # In case customer apply coupon code
        total_initial_total = Decimal(0.00)
        total_total = Decimal(0.00)



        for c in cart_items:
            CartOrderItems.objects.create(
                order=order,
                product=c.product,
                vendor=c.product.vendor,
                price=c.price,
                qty=c.qty,
                color=c.color,
                size=c.size,
                sub_total=c.sub_total,
                shipping_amount=c.shipping_amount,
                tax_fee=c.tax_fee,
                service_fee=c.service_fee,
                total=c.total,
                initial_total=c.total,
            )

            total_shipping += Decimal(c.shipping_amount)
            total_tax += Decimal(c.tax_fee)
            total_service_fee += Decimal(c.service_fee)
            total_sub_total += Decimal(c.sub_total)
            total_initial_total += Decimal(c.total)
            total_total += Decimal(c.total)

            order.vendor.add(c.product.vendor)

        order.sub_total = total_sub_total
        order.shipping_amount = total_shipping
        order.tax_fee = total_tax
        order.service_fee = total_service_fee
        order.initial_total = total_initial_total
        order.total = total_total

        order.save()

        return Response({'message': 'Order created successfully', 'order_oid': order.oid},
                        status=status.HTTP_201_CREATED)


class CheckoutAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    lookup_field = 'order_oid'

    def get_object(self):
        order_oid = self.kwargs.get('order_oid')
        order = CartOrder.objects.get(oid=order_oid)
        return order


class CouponAPIView(generics.CreateAPIView):
    serializer_class = CouponSerializer
    permission_classes = [AllowAny]
    queryset = Coupon.objects.all()

    def create(self, request, *args, **kwargs):
        payload = request.data
        order_oid = payload['order_oid']
        coupon_code = payload['coupon_code']
        order = CartOrder.objects.get(oid=order_oid)
        coupon = Coupon.objects.filter(code=coupon_code).first()

        if coupon:
            order_items = CartOrderItems.objects.filter(order=order, vendor=coupon.vendor)
            if order_items:
                for i in order_items:
                    if not coupon in i.coupon.all():
                        discount = i.total * coupon.discount / 100

                        i.total -= discount
                        i.sub_total -= discount
                        i.coupon.add(coupon)
                        i.saved += discount

                        order.total -= discount
                        order.sub_total -= discount
                        order.saved += discount

                        i.save()
                        order.save()

                        return Response({'message': 'Coupon activated', 'icon': 'success'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'message': 'Coupon already activated', 'icon': 'warning'},
                                        status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Order does not exist', 'icon': 'error'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Coupon does not exist', 'icon': 'error'}, status=status.HTTP_200_OK)


class StripeCheckoutAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]

    # queryset = CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        order_oid = self.kwargs['order_oid']
        order = CartOrder.objects.get(oid=order_oid)
        if not order:
            return Response({'message': 'order not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            checkout_session = stripe.checkout.Session.create(
                customer_email=order.email,
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': order.full_name,
                            },
                            'unit_amount': int(order.total * 100)
                        },
                        'quantity': 1,
                    }

                ],
                mode='payment',
                success_url='http://localhost:5173/payment-success/' + order.oid + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:5173/payment-failed/?session_id={CHECKOUT_SESSION_ID}'
            )
            order.stripe_session_id = checkout_session.id
            order.save()

            return redirect(checkout_session.url)
        except stripe.error.StripeError as e:
            return Response({"error": f"Sth went wrong while creating checkout session: {str(e)}"})


class PaymentSuccessAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        payload = request.data
        order_oid = payload['order_oid']
        session_id = payload['session_id']

        order = CartOrder.objects.filter(oid=order_oid).first()
        print("order======= : ", order)
        order_items = CartOrderItems.objects.filter(order=order)

        if session_id != 'null':
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == 'paid':
                if order.payment_status == 'pending':
                    order.payment_status = 'paid'
                    order.save()

                    context = {
                        'order': order,
                        'order_items': order_items,
                    }
                    # Send an email to customer after an order get placed
                    subject = "Ventuno - Order placed successfully"
                    text_body = render_to_string("email/customer_order_confirmation.txt", context)
                    html_body = render_to_string("email/customer_order_confirmation.html", context)

                    msg = EmailMultiAlternatives(
                        subject=subject,
                        from_email=settings.EMAIL_HOST_USER,
                        to=[order.email],
                        body=text_body
                    )
                    msg.attach_alternative(html_body, 'text/html')
                    msg.send()

                    # send notif to customer
                    if order.buyer != None:
                        send_notification(user=order.buyer, order=order)
                    # send notif to vendors
                    for o in order_items:
                        # Sending an email to vendor after an order get placed
                        vendor_context = {
                            'vendor': o.vendor
                        }
                        print('email================:', o.vendor.user.email)
                        subject = "Ventuno - Happy New Sale"
                        text_body = render_to_string("email/vendor_sale.txt", vendor_context)
                        html_body = render_to_string("email/vendor_sale.html", vendor_context)

                        msg = EmailMultiAlternatives(
                            subject=subject,
                            from_email=settings.EMAIL_HOST_USER,
                            to=[o.vendor.user.email],
                            body=text_body
                        )
                        msg.attach_alternative(html_body, 'text/html')
                        msg.send()

                        send_notification(vendor=o.vendor, order=order, order_item=o)

                    return Response({"message": "Payment successfull"})
                else:
                    return Response({"message": "Already paid"})
            elif session.payment_status == 'unpaid':
                return Response({"message": "Your invoice is unpaid"})
            elif session.payment_status == 'cancelled':
                return Response({"message": "Your invoice is cancelled"})
            else:
                return Response({"message": "An error occur red, try again ..."})


def send_notification(user=None, vendor=None, order=None, order_item=None):
    Notification.objects.create(
        user=user,
        vendor=vendor,
        order=order,
        order_item=order_item
    )


class ReviewListAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        print('product_id=============', product_id)
        product = Product.objects.get(id=product_id)
        reviews = Review.objects.filter(product=product)
        return reviews

    def create(self, request, *args, **kwargs):
        payload = request.data
        print('payload=========', payload)
        user_id = payload['user_id']
        product_id = payload['product_id']
        rating=payload['rating']
        review=payload['review']

        user=User.objects.get(id=user_id)
        product=Product.objects.get(id=product_id)

        Review.objects.create(
            user=user,
            product=product,
            rating=rating,
            review=review
        )

        return Response({'message':'Review created successfully'}, status=status.HTTP_201_CREATED)



class SearchProductAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def get_queryset(self):
        query = self.request.GET.get('query')
        print('query=========', query)
        products = Product.objects.filter(title__icontains=query)
        print('products=======', products)
        return products

