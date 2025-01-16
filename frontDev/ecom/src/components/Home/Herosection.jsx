import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddToCart from "../usercartsections/AddToCart";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const Slider = () => {
  const [products, setProducts] = useState([]);
  
  const slides = [
    { id: 1, image: "https://via.placeholder.com/800x400?text=Slide+1", title: "Slide 1" },
    { id: 2, image: "https://via.placeholder.com/800x400?text=Slide+2", title: "Slide 2" },
    { id: 3, image: "https://via.placeholder.com/800x400?text=Slide+3", title: "Slide 3" },
  ];
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response =  await axios.get(`${apiUrl}/products/`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

 


  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
    <div className="relative w-full max-w-5xl mt-3 mx-auto overflow-hidden rounded-lg">
      {/* Slides */}
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full">
            <img src={slide.image} alt={slide.title} className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
    <div className="container mx-auto my-1 p-6 flex items-center justify-between ">
  {/* Left Section */}
  <div>
    <Link
      to=""
      className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition duration-200"
    >
      Categories Name
    </Link>
  </div>

  {/* Right Section */}
  <div>
    <Link
      to="/shop"
      className="text-lg  text-pink-600  transition duration-200"
    >
      See More
    </Link>
  </div>
</div>

    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
          key={product.id}
          className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          {/* Image Section */}
          <div className="h-44 bg-gray-100">
            <img
             loading="lazy"
              src={product.img || "https://via.placeholder.com/140"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Content Section */}
          <div className="p-4">
            <h2 className=" text-center text-gray-700 truncate">{product.name}</h2>
          </div>
          <div className="my-2">
           <AddToCart productId={product.id} />
          </div>
        </div>
        ))}
      </div>
    </div>
   
    </>
  );
};

export default Slider;
