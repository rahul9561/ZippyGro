import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('jwtToken');
      const storedUsername = localStorage.getItem('username');

      if (!token) {
        setErrorMessage('Please log in to view the cart');
        return;
      }

      if (storedUsername) {
        setUsername(storedUsername);
      }

      try {
        const response = await axios.get(`${apiUrl}/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [apiUrl]);

  const total = cartItems.reduce((acc, item) => acc + (item.product && item.product.price ? parseFloat(item.product.price) * item.quantity : 0), 0);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

      {username && <p className="text-gray-700 mb-4">Welcome, {username}!</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              {item.product && item.product.img && (
                <img src={item.product.img} alt={item.product.name} className="w-20 h-20 object-cover" />
              )}
              <div>
                <p className="text-lg font-medium">{item.product ? item.product.name : 'Unknown Product'}</p>
                <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-lg font-semibold">₹{item.product && item.product.price ? parseFloat(item.product.price).toFixed(2) : 'N/A'}</p>
              <p className="text-sm text-gray-500">Total: ₹{item.product && item.product.price ? (parseFloat(item.product.price) * item.quantity).toFixed(2) : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</p>
        <Link to="/checkout" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
