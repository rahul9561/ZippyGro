import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryIcon from "@mui/icons-material/Category";
import { Link } from "react-router-dom";
const apiUrlv = import.meta.env.VITE_API_URL;


const Category = () => {
  const [data, setData] = useState([]); // Categories data
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  // Fetch categories
  const fetchCategories = async () => {
    const apiUrl = `${apiUrlv}/categories/`;
    try {
      const response = await axios.get(apiUrl);
      setData(response.data); // Update categories state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="relative">
      <div
        className="tp-header-action-5 cursor-pointer flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full hover:bg-blue-600 transition-all"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <i className="fa-solid fa-th-large text-2xl text-white"></i>
      </div>

      {/* Sidebar for categories */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg w-60 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between p-4 text-white"
          style={{ backgroundColor: "rgb(73, 151, 61)" }}
        >
          <h2 className="text-lg font-bold">Categories</h2>
          <button
            className="text-4xl focus:outline-none hover:text-gray-300 transition-all"
            onClick={() => setIsSidebarOpen(false)}
          >
            &times;
          </button>
        </div>

        {/* Categories List */}
        <div className="p-4 space-y-2">
          {data.length > 0 ? (
            data.map((category) => (
              <div
                key={category.id}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
              >
                {/* Corrected query parameter for Link */}
                <Link to={`/shop?category_id=${category.id}`}>
  {category.name}
</Link>

              </div>
            ))
          ) : (
            <p className="text-gray-500">No categories available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
