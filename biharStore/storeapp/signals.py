from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Order, OrderItem, Product
import logging

# Logger for debugging
logger = logging.getLogger(__name__)


# -------------------------------
# 1️⃣ Update stock when an order is created
# -------------------------------
@receiver(post_save, sender=Order)
def update_stock_on_order(sender, instance, created, **kwargs):
    if created:  # Only for new orders
        for item in instance.order_items.all():  # use related_name 'order_items'
            product = item.product
            if product.stock >= item.quantity:
                product.stock -= item.quantity
                product.save()
                logger.info(
                    f"Stock updated for {product.name} (ID: {product.id}). Remaining stock: {product.stock}"
                )
            else:
                logger.warning(
                    f"Insufficient stock for {product.name} (ID: {product.id}). "
                    f"Available: {product.stock}, Requested: {item.quantity}"
                )


# -------------------------------
# 2️⃣ Send email when order status changes to Delivered
# -------------------------------
@receiver(pre_save, sender=Order)
def notify_on_status_change(sender, instance, **kwargs):
    if not instance.pk:
        return  # New order, skip

    previous = Order.objects.get(pk=instance.pk)
    if previous.status != 'Delivered' and instance.status == 'Delivered':
        try:
            send_mail(
                subject='Your Order is Delivered!',
                message=(
                    f"Hello {instance.user.username},\n\n"
                    f"Your order #{instance.id} has been delivered successfully.\n\n"
                    "Thank you for shopping with us!"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.user.email],
                fail_silently=False,
            )
            logger.info(f"Delivery notification sent to {instance.user.email} for Order #{instance.id}")
        except Exception as e:
            logger.error(f"Failed to send delivery notification for Order #{instance.id}: {str(e)}")
