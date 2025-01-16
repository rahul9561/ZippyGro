from django.contrib import admin
from .models import *


# Custom User Admin
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('username', 'email')
    ordering = ('username',)


# Delivery Address Admin
@admin.register(DeliveryAddress)
class DeliveryAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'street', 'city', 'state', 'country', 'postal_code')
    search_fields = ('street', 'city', 'state', 'postal_code', 'user__username')


# Category Admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    search_fields = ('name',)
    list_filter = ('parent',)


# Product Admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', "img" , 'base_price', 'selling_Price', 'stock_quantity')
    list_filter = ('category',)
    search_fields = ('name', 'category__name')
    ordering = ('name',)


# Order Item Inline for Order Admin
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1


# Order Admin
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_amount', 'assigned_agent', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('user__username', 'assigned_agent__username')
    ordering = ('-created_at',)
    inlines = [OrderItemInline]


# Order Item Admin
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity')
    search_fields = ('order__id', 'product__name')
    list_filter = ('order',)


# Cart Admin
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity', 'created_at', 'updated_at')
    search_fields = ('user__username', 'product__name')
    ordering = ('-created_at',)


