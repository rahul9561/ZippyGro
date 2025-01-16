from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import *
import logging

# Set up logging for debugging purposes
logger = logging.getLogger(__name__)

@receiver(post_save, sender=Order)
def update_stock_on_order(sender, instance, created, **kwargs):
    """
    Updates product stock when a new order is created.
    """
    if created:  # Trigger only when a new order is created
        for product_data in instance.product_ids:
            try:
                # Retrieve the product based on the product ID
                product_obj = Product.objects.get(id=product_data['id'])

                # Check and update stock based on the quantity ordered
                if product_obj.stock >= product_data['quantity']:
                    product_obj.stock -= product_data['quantity']
                    product_obj.save()
                    logger.info(
                        f"Stock updated for product {product_obj.name} (ID: {product_obj.id}). Remaining stock: {product_obj.stock}"
                    )
                else:
                    logger.error(
                        f"Insufficient stock for product {product_obj.name} (ID: {product_obj.id}). "
                        f"Available: {product_obj.stock}, Requested: {product_data['quantity']}"
                    )
                    raise ValueError(
                        f"Insufficient stock for product {product_obj.name}. Available: {product_obj.stock}, "
                        f"Requested: {product_data['quantity']}"
                    )

            except Product.DoesNotExist:
                logger.error(f"Product with ID {product_data['id']} does not exist.")
                raise ValueError(f"Product with ID {product_data['id']} does not exist.")


@receiver(post_save, sender=Order)
def notify_on_status_change(sender, instance, **kwargs):
    """
    Sends email notifications to the user when the order status changes to 'Delivered'.
    """
    if instance.status == 'Delivered':
        try:
            send_mail(
                'Order Delivered',
                f'Hello {instance.user.username},\n\nYour order #{instance.id} has been successfully delivered!'
                '\n\nThank you for shopping with us.',
                settings.DEFAULT_FROM_EMAIL,
                [instance.user.email],
                fail_silently=False,  # Set to False to raise an error if sending fails
            )
            logger.info(f"Delivery notification sent to {instance.user.email} for Order #{instance.id}.")
        except Exception as e:
            logger.error(
                f"Failed to send delivery notification for Order #{instance.id} to {instance.user.email}. Error: {str(e)}"
            )



# @receiver(post_save, sender=User)
# def assign_default_group(sender, instance, created, **kwargs):
#     if created:
#         if instance.role == 'customer':
#             group = Group.objects.get(name='Customer Group')
#             instance.groups.add(group)
