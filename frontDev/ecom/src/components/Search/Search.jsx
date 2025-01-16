import React, { useEffect, useState } from "react";
import AddToCart from "../usercartsections/AddToCart";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Search = ({searchQuery,setSearchQuery,handleSearch}) => {
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();

  // Extract query parameter from the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("name") || "";
    setSearchQuery(query);

    if (query) {
      fetchProducts(query);
    }
  }, [location.search]);

  const fetchProducts = (query) => {
    setLoading(true);
    setError(null);

    const url = query
      ? `http://127.0.0.1:8000/api/products/search/?name=${query}`
      : `http://127.0.0.1:8000/api/products/`;

    axios
      .get(url)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      });
  };

  const fetchSuggestions = (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/products/suggestions/?name=${query}`)
      .then((response) => {
        setSuggestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
      });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

   handleSearch = () => {
    fetchProducts(searchQuery);
    console.log("hello")
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-1xl font-bold text-white mb-6 text-left">
  {searchQuery ? (
    <>
      Results for <span className="text-red-600">"{searchQuery}"</span>
    </>
  ) : (
    "Search Products"
  )}
</h1>


      <div className="flex flex-col items-center mobile-search absolute  top-3 fix-pad" >
        <div className="relative w-full max-w-md">
        <button
          onClick={handleSearch}
          style={{top:"1px"}}
          className="bg-blue-500 absolute  right-0 text-white px-5 py-3 rounded-lg  hover:bg-blue-600"
        >
          Search
        </button>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            style={{ paddingRight: "12rem" }}
            className="py-3 pl-6 w-full fix-pad rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(suggestion.name);
                    setSuggestions([]);
                  }}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>
       
      </div>

      {loading && <p className="text-gray-500 text-center mt-10">Loading products...</p>}

      {error && <p className="text-red-500 text-center mt-10">{error}</p>}

      {!loading && !error && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 my-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="h-48 bg-gray-100">
                <img
                  src={product.img || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 truncate">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  {product.description.split(" ").slice(0, 10).join(" ")}
                  {product.description.split(" ").length > 10 && "..."}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-4">
                  Price: ₹{product.price}
                </p>
                <AddToCart productId={product.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <p className="text-gray-500 text-center mt-10">
            {searchQuery ? "No products found." : "Please enter a search query."}
          </p>
        )
      )}
    </div>
  );
};

export default Search;

