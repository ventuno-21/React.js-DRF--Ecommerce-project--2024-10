from django.urls import path
from app_auth import views as auth_views
from app_store import views as store_views
from app_customer import views as customer_views
from app_vendor import views as vendor_views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="This is the API documentation for e-commerce project APIs",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="ventuno.site@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # app_user endpoints
    path('user/token/', auth_views.MyTokenObtainPairView.as_view()),
    path('user/token/referesh/', TokenRefreshView.as_view()),
    path('user/register/', auth_views.RegisterAPIView.as_view()),
    path('user/password-reset/<email>/', auth_views.PasswordResetEmailVerify.as_view()),
    path('user/password-change/', auth_views.PasswordChangeView.as_view(), name="password_change"),
    path('user/profile/<user_id>/', auth_views.ProfileAPIView.as_view()),

    # store endpoints
    path('category/', store_views.CategortListAPIView.as_view()),
    path('products/', store_views.ProductListAPIView.as_view()),
    path('products/<slug:slug>/', store_views.ProductDetailAPIView.as_view()),
    path('cart-view/', store_views.CartAPIView.as_view()),
    path('cart-list/<str:cart_id>/', store_views.CartListView.as_view()),
    path('cart-list/<str:cart_id>/<int:user_id>/', store_views.CartListView.as_view()),
    path('cart-detail/<str:cart_id>/', store_views.CartDetailView.as_view()),
    path('cart-detail/<str:cart_id>/<int:user_id>/', store_views.CartDetailView.as_view()),
    path('cart-delete/<str:cart_id>/<int:item_id>/', store_views.CartItemDeleteAPIView.as_view()),
    path('cart-delete/<str:cart_id>/<int:item_id>/<int:user_id>/', store_views.CartItemDeleteAPIView.as_view()),
    path('checkout/<str:order_oid>/', store_views.CheckoutAPIView.as_view()),
    path('coupon/', store_views.CouponAPIView.as_view()),
    path('create-order/', store_views.CreateOrderAPIView.as_view()),
    path('payment-success/<str:order_oid>/', store_views.PaymentSuccessAPIView.as_view()),
    path('reviews/<product_id>/', store_views.ReviewListAPIView.as_view()),
    path('search/', store_views.SearchProductAPIView.as_view()),

    # payment endpoints
    path('stripe-checkout/<order_oid>/', store_views.StripeCheckoutAPIView.as_view()),

    # Customer Endpoints
    path('customer/orders/<user_id>/', customer_views.OrderAPIView.as_view()),
    path('customer/order/<user_id>/<order_oid>/', customer_views.OrderDetailAPIView.as_view()),
    path('customer/wishlist/<user_id>/', customer_views.WishlistAPIView.as_view()),
    path('customer/notification/<user_id>/', customer_views.CustomerNotificationAPIView.as_view()),
    path('customer/notification/<user_id>/<notif_id>/', customer_views.MarkCustomerNotificationAsSeenAPIView.as_view()),

    # Vendor Endpoints
    path('vendor/stats/<vendor_id>/', vendor_views.DashboardStatsAPIView.as_view()),
    path('vendor/products/<vendor_id>/', vendor_views.ProductAPIView.as_view()),
    path('vendor/orders/<vendor_id>/', vendor_views.OrderAPIView.as_view()),
    path('vendor/revenue/<vendor_id>/', vendor_views.RevenueAPIView.as_view()),
    path('vendor/orders/<vendor_id>/<order_oid>/', vendor_views.OrderDetailAPiView.as_view()),
    path('vendor/orders/filter/<int:vendor_id>', vendor_views.FilterOrderAPIView.as_view()),
    path('vendor-order-chart/<vendor_id>/', vendor_views.monthly_orders_chart_apiview),
    path('vendor-product-chart/<vendor_id>/', vendor_views.monthly_products_chart_apiview),
    path('vendor-product-filter/<vendor_id>/', vendor_views.FilterProduuctAPIView.as_view()),
    path('vendor-earning/<vendor_id>/', vendor_views.EarningAPIView.as_view()),
    path('vendor-monthly-earning/<vendor_id>/', vendor_views.monthly_earning_tracker),
    path('vendor-reviews/<vendor_id>/', vendor_views.ReviewListAPIView.as_view()),
    path('vendor-reviews/<vendor_id>/<review_id>/', vendor_views.ReviewDetailAPIView.as_view()),
    path('vendor-coupon-list/<vendor_id>/', vendor_views.CouponListCreateAPIView.as_view()),
    path('vendor-coupon-detail/<vendor_id>/<coupon_id>/', vendor_views.CouponDetailAPIView.as_view()),
    path('vendor-coupon-stats/<vendor_id>/', vendor_views.CouponStatsAPIView.as_view()),
    path('vendor-notif-list/<vendor_id>/', vendor_views.NotificationAPIView.as_view()),
    path('vendor-notif-summary/<vendor_id>/', vendor_views.NotificationSummaryAPIView.as_view()),
    path('vendor-notif-mark-as-seen/<vendor_id>/<notif_id>/', vendor_views.NotificationVendorMarkAsSeen.as_view()),
    path('vendor-settings/<user_id>/', vendor_views.VendorProfileUpdateAPIView.as_view()),
    path('vendor-shop-settings/<user_id>/', vendor_views.ShopUpdateAPIView.as_view()),
    path('shop/<vendor_slug>/', vendor_views.ShopAPIView.as_view()),
    path('shop-products/<vendor_slug>/', vendor_views.ShopProductAPIView.as_view()),
    path('vendor-create-product/', vendor_views.ProductCreateView.as_view()),
    path('vendor-update-product/<vendor_id>/<product_pid>/', vendor_views.ProductUpdateView.as_view()),
    path('vendor-delete-product/<vendor_id>/<product_pid>/', vendor_views.ProductDeleteAPIView.as_view()),

    # YasG library endpoints
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
