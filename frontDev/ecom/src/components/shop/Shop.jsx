import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AddToCart from "../usercartsections/AddToCart";
const apiUrl = import.meta.env.VITE_API_URL;

const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category_id");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = categoryId
          ? await axios.get(
              `${apiUrl}/products/filter-by-category/${categoryId}/`
            )
          : await axios.get(`${apiUrl}/products/`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Products List
      </h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Image Section */}
              <div className="h-36 bg-gray-100">
                <img
                  src={product.img || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Content Section */}
              <div className="p-4">
                <h5 className="font-semibold text-gray-800 truncate">
                  {product.name}
                </h5>
                <p className="text-gray-900 mt-4">Price: ₹{product.price}</p>
              </div>
              <div className="my-2">
                <AddToCart productId={product.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          No products found for the selected category.
        </p>
      )}
    </div>
  );
};

export default Shop;
