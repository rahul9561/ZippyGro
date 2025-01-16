import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Product

# def get_recommendations(product_id, products_queryset, top_n=10):
#     # Create a DataFrame from the QuerySet
#     data = pd.DataFrame(list(products_queryset.values('id', 'name', 'description')))
    
#     # Check if the product_id exists in the DataFrame
#     if product_id not in data['id'].values:
#         raise ValueError("Product ID not found in the product list.")
    
#     # Check for empty or missing descriptions
#     if data['description'].isnull().any() or data['description'].str.strip().eq('').any():
#         raise ValueError("Some products have empty or missing descriptions.")

#     # Initialize TF-IDF Vectorizer
#     tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=5000, ngram_range=(1, 2))

#     # Fit and transform the product descriptions
#     tfidf_matrix = tfidf_vectorizer.fit_transform(data['description'])

#     # Compute cosine similarity
#     cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

#     # Get the index of the input product
#     product_idx = data.index[data['id'] == product_id].tolist()[0]

#     # Get similarity scores for the input product
#     sim_scores = list(enumerate(cosine_sim[product_idx]))

#     # Sort products by similarity score (excluding the input product)
#     sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

#     # Get the indices of the top_n similar products
#     top_indices = [idx for idx, score in sim_scores[1:top_n+1]]

#     # Retrieve the recommended products
#     recommended_products = data.iloc[top_indices]

#     return recommended_products[['id', 'name']]

# Example usage:
# from your_app.models import Product
# products_queryset = Product.objects.all()
# recommendations = get_recommendations(product_id=1, products_queryset=products_queryset, top_n=5)
# print(recommendations)





def get_recommendations(product_id, top_n=10):
    # Get all product descriptions
    product_description = list(Product.objects.values_list('description', flat=True))
    
    if not product_description:
        raise ValueError("No product descriptions available.")

    # Initialize TF-IDF vectorizer
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000, ngram_range=(1, 2))
    tfid_matrix = vectorizer.fit_transform(product_description)

    # Find the target product index
    try:
        target_product = Product.objects.get(id=product_id)
        all_products = list(Product.objects.all())
        target_index = all_products.index(target_product)
    except Product.DoesNotExist:
        raise ValueError(f"Product with ID {product_id} does not exist.")
    
    # Compute cosine similarity for the target product
    cosine_sim = cosine_similarity(tfid_matrix[target_index], tfid_matrix).flatten()

    # Get indices of top N similar products (excluding the target product itself)
    similar_indices = cosine_sim.argsort()[::-1]  # Sort by descending similarity
    similar_indices = [idx for idx in similar_indices if idx != target_index][:top_n]

    # Retrieve recommended products
    recommended_products = [all_products[idx] for idx in similar_indices]

    # Output recommendations
    for product in recommended_products:
        print(f"Recommended: {product.name} (ID: {product.id})")

# Example usage
get_recommendations(2616)
