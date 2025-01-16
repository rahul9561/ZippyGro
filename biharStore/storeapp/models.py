from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('customer', 'Customer'),
        ('delivery_agent', 'Delivery Agent'),
    ]

    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='customer')

    # Custom groups and permissions fields
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',
        blank=True
    )

    def __str__(self):
        return f"{self.username} ({self.role})"

    def get_tokens(self):
        """
        Generate JWT tokens for the user.
        """
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }





class DeliveryAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='delivery_addresses')
    full_name = models.CharField(max_length=255, blank=True)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}, {self.country} - {self.postal_code}"




# Category model
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='subcategories', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.parent.name} -> {self.name}" if self.parent else self.name


# Product model
class Product(models.Model):
    name = models.CharField(max_length=255)
    img = models.ImageField(upload_to='product/', null=True, blank=True)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    description = models.TextField(null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    selling_Price= models.DecimalField(max_digits=10, decimal_places=2,null=True)
    stock_quantity = models.PositiveIntegerField(default=0,null=True)

    def __str__(self):
        return self.name


# Order model with enhanced functionality
class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Assigned', 'Assigned'),
        ('In Transit', 'In Transit'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    products = models.ManyToManyField(Product, through='OrderItem', related_name='orders')
    delivery_address = models.ForeignKey(DeliveryAddress, on_delete=models.SET_NULL, null=True, blank=True)
    assigned_agent = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_orders',
        limit_choices_to={'role': 'delivery_agent'}
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    estimated_delivery_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.status}"

    def calculate_total(self):
        total = sum(item.product.price * item.quantity for item in self.order_items.all())
        self.total_amount = total
        self.save()


# OrderItem model
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"






# Cart model
class Cart(models.Model):
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='cart',
        null=True
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_price(self):
        """
        Calculate total price for the product in the cart.
        """
        return self.product.price * self.quantity

    def __str__(self):
        return f"Cart: {self.user.username} - {self.product.name} ({self.quantity})"

    @staticmethod
    def add_or_update_product(user, product, quantity):
        """
        Add a product to the cart or update its quantity.
        If the quantity becomes zero or negative, the product is removed from the cart.
        """
        cart_item, created = Cart.objects.get_or_create(user=user, product=product)
        if created or cart_item.quantity + quantity > 0:
            cart_item.quantity = cart_item.quantity + quantity if not created else quantity
            cart_item.save()
            return cart_item
        else:
            cart_item.delete()
            return None
