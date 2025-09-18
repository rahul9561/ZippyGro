# myapp/management/commands/reset_products.py
from django.core.management.base import BaseCommand
from django.db import connection
from storeapp.models import Product

class Command(BaseCommand):
    help = "Delete all products and reset ID sequence"

    def handle(self, *args, **kwargs):
        Product.objects.all().delete()
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='myapp_product';")
        self.stdout.write(self.style.SUCCESS("All products deleted and ID reset!"))
