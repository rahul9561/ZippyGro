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


from django.contrib import admin
from django.utils.html import mark_safe

# Category Admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Added display_order


# Product Admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'image_preview', 'base_price', 'selling_price', 'stock_quantity', 'stock_status')
    list_filter = ('category',)
    search_fields = ('name', 'category__name')
    ordering = ('name',)
    readonly_fields = ('stock_status',)

    def image_preview(self, obj):
        if obj.img:
            return mark_safe(f'<img src="{obj.img}" style="width: 50px; height: 50px;" />')
        return "No Image"
    image_preview.short_description = "Image Preview"  # Label for the admin column





# Order Admin
admin.site.register(Order)

admin.site.register(OrderItem)

admin.site.register(ProductVariant)

# Cart Admin
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity', 'created_at', 'updated_at')
    search_fields = ('user__username', 'product__name')
    ordering = ('-created_at',)


