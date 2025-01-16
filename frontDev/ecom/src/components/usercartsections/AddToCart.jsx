import React, { useState } from 'react';
import axios from 'axios';

const AddToCart = ({ productId }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const addToCart = async () => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      setMessage('Please log in to add items to the cart');
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/cart/`,
        { product: productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Item added to cart successfully');
    } catch (error) {
      setMessage('Failed to add item to cart');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-16 p-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
        min="1"
      />
      <button
        onClick={addToCart}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300"
      >
        Add to Cart
      </button>
      {message && (
        <p
          className={`text-sm ${
            message === 'Item added to cart successfully' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddToCart;
