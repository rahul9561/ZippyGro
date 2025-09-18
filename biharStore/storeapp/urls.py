from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'delivery-addresses', DeliveryAddressViewSet, basename='addresses')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'), 
    path('login/', LoginView.as_view(), name='login'),
    path("create-order/", create_order, name="create_order"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('products/filter-by-category/<int:category_id>/', FilterProductsByCategory.as_view()),


    # ✅ new search endpoint
    path('search/products/', SearchProductsView.as_view(), name='search-products'),
]

    



