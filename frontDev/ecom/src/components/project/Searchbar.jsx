import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Searchbar = () => {
  const products = [
    "Apple",
    "Banana",
    "Orange",
    "Milk",
    "Bread",
    "Cheese",
    "Eggs",
    "Tomatoes",
    "Potatoes",
    "Rice",
    "Pasta",
  ];

  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('Search for "items"');

  // Handle input change and filter products
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      setShowSuggestions(false); // Hide suggestions if input is empty
    } else {
      const suggestions = products.filter((product) =>
        product.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(suggestions);
      setShowSuggestions(true); // Show suggestions if there are matches
    }
  };

  // Cycle through filtered product names automatically
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const intervalId = setInterval(() => {
        setSelectedProductIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % filteredProducts.length;
          setSearchText(filteredProducts[nextIndex]); // Automatically update product name
          return nextIndex;
        });
      }, 1000); // Change product name every second (1000 ms)

      return () => clearInterval(intervalId); // Clean up interval on component unmount
    }
  }, [filteredProducts]);

  // Cycle placeholder text through product names
  useEffect(() => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      setPlaceholderText(`Search for "${products[currentIndex]}"`);
      currentIndex = (currentIndex + 1) % products.length;
    }, 1000); // Update placeholder every second

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  // Hide suggestions when clicking outside the search bar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".searchbar-container")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Link to='/search' style={{cursor:"pointer"}}>
    <div className="flex items-center relative w-full searchbar-container">
      {/* Search Button */}
      <button
        type="button"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 px-4 py-2 font-medium rounded-l-lg border-none"
      >
        <i className="fa-solid fa-search"></i>
      </button>

      {/* Search Input */}
      <input
        type="text"
        placeholder={placeholderText}
        className="py-2 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        style={{ paddingRight: "11rem" }}
        value={searchText}
        onChange={handleInputChange}
      />

      {/* Suggestions Dropdown with Animation */}
      <div
        className={`absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-40 overflow-y-auto transition-all duration-300 ${
          showSuggestions ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        {filteredProducts.length > 0 &&
          filteredProducts.map((product, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-green-100"
              onClick={() => setSearchText(product)} // Select product from suggestions
            >
              {product}
            </div>
          ))}
      </div>
    </div>
    </Link>
  );
};

export default Searchbar;
