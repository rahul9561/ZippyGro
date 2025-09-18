from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken


# =======================
# Custom User Model
# =======================
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


# =======================
# Delivery Address
# =======================
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

# =======================
# Category & Product
# =======================
class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    img = models.URLField(blank=True, null=True)  # Or ImageField if handling uploads
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

    @property
    def stock_status(self):
        return "In Stock" if self.stock_quantity > 0 else "Out of Stock"

    class Meta:
        indexes = [
            models.Index(fields=['name']),
        ]



# =======================
# Product Variant
# =======================
class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )
    name = models.CharField(max_length=255)  # e.g., "128GB - Titanium Blue"
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)  # Stock Keeping Unit
    price_modifier = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Price adjustment from Product.selling_price (can be positive or negative)"
    )
    stock_quantity = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.name}"

    @property
    def total_price(self):
        """
        Calculate the total price for this variant (base price + modifier).
        """
        base_price = self.product.selling_price or self.product.base_price or 0
        return base_price + self.price_modifier

    @property
    def stock_status(self):
        """
        Return stock status for this variant.
        """
        return "In Stock" if self.stock_quantity > 0 else "Out of Stock"

    class Meta:
        indexes = [
            models.Index(fields=['product', 'name']),
            models.Index(fields=['sku']),
        ]
        unique_together = [['product', 'name']]  # Ensure unique variant names per product


# =======================
# Cart Model
# =======================
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart', null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_price(self):
        """
        Calculate total price for the product in the cart.
        """
        return self.product.selling_price * self.quantity if self.product.selling_price else 0

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


# =======================
# Order & OrderItem
# =======================
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
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_orders',
        limit_choices_to={'role': 'delivery_agent'}
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    estimated_delivery_time = models.DateTimeField(null=True, blank=True)  # Fixed from TimeField
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.status}"

    def total_price(self):
        """
        Recalculate and update the order total.
        """
        total = sum(item.total_price for item in self.order_items.all())
        self.total_amount = total
        self.save()


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_order = models.DecimalField(max_digits=10, decimal_places=2,null=True)  # store snapshot price

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"

    @property
    def total_price(self):
        price = self.price_at_order or 0  # default to 0 if None
        return price * self.quantity

