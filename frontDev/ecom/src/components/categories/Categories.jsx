import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const apiUrlv = import.meta.env.VITE_API_URL;

const Categories = () => {// Categories data

  const fetchCategories = async () => {
    const apiUrl =  `${apiUrlv}/categories/`;
    try {
      const response = await axios.get(apiUrl);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {data.length > 0 ? (
          data.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category_id=${category.id}`}
              className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={category.image_url} // Replace with the correct key for the category image URL
                alt={category.name}
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
              <span className="text-sm font-medium text-gray-800">
                {category.name}
              </span>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No categories available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Categories;
