import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Address from '../usercartsections/Address';

const Checkout = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Retrieve username and jwtToken from localStorage
  const storedUsername = localStorage.getItem('username');
  const storedToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!storedToken || !storedUsername) {
        setErrorMessage('Please log in to view your cart.');
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/cart/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        setCartItems(response.data || []);
        setErrorMessage('');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMessage('Session expired. Please log in again.');
        } else {
          setErrorMessage('Failed to fetch cart items.');
        }
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [apiUrl, storedToken, storedUsername]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product?.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return total + price * quantity;
    }, 0);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Address */}
          <Address />

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            {cartItems.length > 0 ? (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span>{item.product?.name || 'Unknown Product'}</span>
                    <span className="font-semibold">
                      ₹{(parseFloat(item.product?.price) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Your cart is empty.</p>
            )}
            <hr className="my-4" />
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <button
              className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={cartItems.length === 0}
            >
              Proceed to Payment
            </button>
          </div>
        </div>

        {/* Error or Success Messages */}
        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Checkout;
