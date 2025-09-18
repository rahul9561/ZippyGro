import csv
from django.core.management.base import BaseCommand
from storeapp.models import Product, Category
from django.db import connection

class Command(BaseCommand):
    help = 'Delete old products, reset IDs, and import products from CSV'

    def handle(self, *args, **kwargs):
        file_path = 'products.csv'

        # Step 1: Delete old products
        Product.objects.all().delete()

        # Step 2: Reset auto-increment IDs for products
        with connection.cursor() as cursor:
            if 'sqlite' in connection.settings_dict['ENGINE']:
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='storeapp_product';")
            elif 'postgresql' in connection.settings_dict['ENGINE']:
                cursor.execute("ALTER SEQUENCE storeapp_product_id_seq RESTART WITH 1;")
            elif 'mysql' in connection.settings_dict['ENGINE']:
                cursor.execute("ALTER TABLE storeapp_product AUTO_INCREMENT = 1;")

        # Step 3: Read CSV and insert fresh products
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                category, _ = Category.objects.get_or_create(name=row['category'])
                Product.objects.create(
                    name=row['name'],
                    category=category,
                    description=row.get('description', ''),
                    base_price=row.get('base_price', 0) or 0,
                    selling_price=row.get('selling_price', 0) or 0,
                    img=row.get('img', ''),
                    stock_quantity=row.get('stock_quantity', 0) or 0
                )

        self.stdout.write(self.style.SUCCESS('Products imported successfully with reset IDs'))
