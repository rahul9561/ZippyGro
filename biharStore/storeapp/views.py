from rest_framework import viewsets, permissions, status,generics
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated ,AllowAny
from rest_framework.decorators import action
# from .product_recommendation import get_recommendations
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import *
from .serializers import *


# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return super().get_permissions()



class DeliveryAddressViewSet(viewsets.ModelViewSet):
    serializer_class = DeliveryAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeliveryAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"detail": "You do not have permission to update this address."},
                status=status.HTTP_403_FORBIDDEN,
            )

        partial = kwargs.pop("partial", False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)




# Category ViewSet
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# Product ViewSet
from rest_framework import filters

# views.py (Updated ProductViewSet)

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]  # Change to IsAuthenticated if needed
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def suggestions(self, request):
        """
        Retrieve product suggestions based on a partial name or description query.
        Query params:
          - name: required (string)
          - limit: optional (int, default=5, min=1, max=20)
        """
        query = request.query_params.get('name', '').strip()
        limit = request.query_params.get('limit', 5)

        # Validate query param
        if not query:
            return Response(
                {"detail": "Query parameter 'name' is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate limit
        try:
            limit = int(limit)
            if limit < 1 or limit > 20:
                raise ValueError
        except ValueError:
            return Response(
                {"detail": "Limit must be an integer between 1 and 20."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch matching products
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )[:limit]

        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class FilterProductsByCategory(APIView):
    permission_classes = [AllowAny]  

    def get(self, request, category_id):
        try:
            products = Product.objects.filter(category_id=category_id)
            if not products.exists():
                return Response({"detail": "No products found for the given category."}, status=404)
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=400)





# cart


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user).select_related('product')

    def create(self, request, *args, **kwargs):
        user = request.user
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        cart_item = Cart.add_or_update_product(user, product, quantity)
        if cart_item:
            serializer = self.get_serializer(cart_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Product removed from cart"}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Product removed from cart"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def increase_quantity(self, request, pk=None):
        """Increase the quantity of a product in the cart."""
        cart_item = self.get_object()
        cart_item.quantity += 1
        cart_item.save()
        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def decrease_quantity(self, request, pk=None):
        """Decrease the quantity of a product in the cart."""
        cart_item = self.get_object()
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
            cart_item.save()
            serializer = self.get_serializer(cart_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            cart_item.delete()
            return Response({"message": "Product removed from cart"}, status=status.HTTP_204_NO_CONTENT)




User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)






# search base
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Q

from .models import Product
from .serializers import ProductSerializer


class SearchProductsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Search products by name or description.
        Query params:
          - q (string, required): search term
          - limit (int, optional, default=5, min=1, max=20)
        """
        query = request.query_params.get('q', '').strip()
        limit = request.query_params.get('limit', 5)

        if not query:
            return Response(
                {"detail": "Query parameter 'q' is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            limit = int(limit)
            if limit < 1 or limit > 20:
                raise ValueError
        except ValueError:
            return Response(
                {"detail": "Limit must be an integer between 1 and 20."},
                status=status.HTTP_400_BAD_REQUEST
            )

        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )[:limit]

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




# orders
from rest_framework import viewsets
from .models import Order
from .serializers import CustomerOrderSerializer, AdminOrderSerializer
from .permissions import OrderPermission


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing orders
    - Customers: view & create only their own orders
    - Delivery Agents: view/update only assigned orders
    - Admins: full control
    """
    permission_classes = [OrderPermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Order.objects.all()
        elif user.role == "delivery_agent":
            return Order.objects.filter(assigned_agent=user)
        return Order.objects.filter(user=user)

    def get_serializer_class(self):
        user = self.request.user
        if user.role in ["admin", "delivery_agent"]:
            return AdminOrderSerializer
        return CustomerOrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




import razorpay
import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def create_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            amount = data.get("amount")
            currency = data.get("currency", "INR")

            if not amount or amount <= 0:
                return JsonResponse({"error": "Invalid amount"}, status=400)

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            payment_order = client.order.create({
                "amount": int(amount),
                "currency": currency,
                "payment_capture": 1
            })
            return JsonResponse(payment_order)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)










