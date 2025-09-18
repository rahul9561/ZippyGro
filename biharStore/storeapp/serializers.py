from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
from django.contrib.auth.models import Group, Permission
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        user = User.objects.filter(username=username).first()
        if user is None or not user.check_password(password):
            raise serializers.ValidationError('Invalid login credentials')
        
        refresh = RefreshToken.for_user(user)
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        return data




class DeliveryAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryAddress
        fields = ['id', 'full_name', 'street', 'city', 'state', 'postal_code', 'country']




# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']



# Product Serializer

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'img', 'category', 'base_price', 'selling_price' ,'stock_quantity']



# cart


class CartSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField()
    product = ProductSerializer()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'quantity', 'total_price', 'created_at', 'updated_at']



# =======================
# OrderItem Serializer
# =======================
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # nested product details
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price_at_order', 'total_price']
        read_only_fields = ['price_at_order', 'total_price']


from rest_framework import serializers
from .models import Order, OrderItem, Product

# -------------------------
# OrderItem Serializer
# -------------------------
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product=ProductSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price_at_order", "total_price"]

    def create(self, validated_data):
        # Set price_at_order automatically from Product
        product = validated_data['product']
        validated_data['price_at_order'] = product.selling_price or 0
        return super().create(validated_data)

# -------------------------
# Customer Order Serializer
# -------------------------
class CustomerOrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)
    delivery_address = DeliveryAddressSerializer(read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_items', 'status' , 'delivery_address', 'total_amount','created_at']

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        # user = self.context['request'].user
        user = validated_data.pop('user', None)
        order = Order.objects.create(user=user, **validated_data)
        
        for item_data in order_items_data:
            product = item_data['product']
            item_data['price_at_order'] = product.selling_price  # set snapshot price
            OrderItem.objects.create(order=order, **item_data)
        
        # Optional: update total_amount in Order
        order.total_price()  # recalculate total
        return order

      




# For admins & delivery agents
class AdminOrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)
    agent_name = serializers.CharField(source="assigned_agent.username", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "user", "user_name", "assigned_agent", "agent_name",
            "delivery_address", "status", "estimated_delivery_time",
            "total_amount", "created_at", "updated_at", "order_items"
        ]
