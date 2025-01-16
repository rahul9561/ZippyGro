import pandas as pd
from django.core.management.base import BaseCommand
from storeapp.models import Category, Product
from django.core.files.base import ContentFile
import requests


class Command(BaseCommand):
    help = 'Import products from a file into the database and upload images to the backend'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'zippy.csv'

        # Load the CSV file
        try:
            df = pd.read_csv(file_path)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File not found: {file_path}"))
            return
        
        # Process each row in the CSV
        for index, row in df.iterrows():
            try:
                # Handle category creation or fetching
                category_name = row['category']
                category, _ = Category.objects.get_or_create(name=category_name)

                # Download and save the image from the URL if provided
                img_url = row.get('img')
                image_file = None
                if img_url and pd.notna(img_url):
                    try:
                        response = requests.get(img_url)
                        if response.status_code == 200:
                            file_name = img_url.split('/')[-1]  # Extract the file name
                            image_file = ContentFile(response.content, name=file_name)
                        else:
                            self.stdout.write(self.style.WARNING(f"Failed to fetch image: {img_url}"))
                    except requests.RequestException as e:
                        self.stdout.write(self.style.WARNING(f"Error downloading image {img_url}: {e}"))

                # Create or update the product
                Product.objects.update_or_create(
                    name=row['name'],
                    category=category,
                    defaults={
                        'description': row.get('description', ''),
                        'base_price': row.get('base_price', None),
                        'selling_Price': row.get('selling_Price', None),
                        'stock_quantity': row.get('stock_quantity', 0),
                        'img': image_file,  # Save the downloaded image
                    }
                )

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing row {index + 1}: {e}"))

        self.stdout.write(self.style.SUCCESS('Successfully imported data and uploaded images'))
