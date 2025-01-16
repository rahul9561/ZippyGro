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
        fields = ['id','full_name', 'street', 'city', 'state', 'postal_code', 'country']




# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'subcategories']

    def get_subcategories(self, obj):
        return CategorySerializer(obj.subcategories.all(), many=True).data


# Product Serializer

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'img', 'category', 'base_price', 'selling_Price' ,'stock_quantity']


# OrderItem Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity']


# Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    delivery_address = DeliveryAddressSerializer()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'delivery_address', 'assigned_agent', 'total_amount',
            'status', 'estimated_delivery_time', 'created_at', 'updated_at', 'order_items'
        ]
        read_only_fields = ['total_amount', 'created_at', 'updated_at']






class CartSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField()
    product = ProductSerializer()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'quantity', 'total_price', 'created_at', 'updated_at']





