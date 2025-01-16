import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Address = () => {
  const token = localStorage.getItem('jwtToken');
  const [address, setAddress] = useState({
    full_name: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'india',
  });
  const [savedAddress, setSavedAddress] = useState(null);
  const [editing, setEditing] = useState(false); // Flag for editing
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error('Please log in to submit the address');
      setErrorMessage('Please log in to submit the address');
      return;
    }

    try {
      if (editing && savedAddress?.id) {
        // Update address (PATCH request)
        const response = await axios.patch(
          `http://127.0.0.1:8000/api/addresses/${savedAddress.id}/`,
          address,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setSuccessMessage('Address updated successfully!');
      } else {
        // Add new address (POST request)
        const response = await axios.post(
          'http://127.0.0.1:8000/api/addresses/',
          address,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setSuccessMessage('Address added successfully!');
      }

      setErrorMessage('');
      setSavedAddress({ ...address });
      setEditing(false); // Reset editing mode
    } catch (error) {
      console.error('Failed to submit address', error);
      setErrorMessage(
        'Failed to submit address: ' + (error.response?.data?.detail || error.message)
      );
      setSuccessMessage('');
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/addresses/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.length > 0) {
          setSavedAddress(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch address', error);
        setErrorMessage('Failed to fetch address. Please try again.');
      }
    };

    if (token) {
      fetchAddress();
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleEdit = () => {
    setEditing(true);
    setAddress({ ...savedAddress }); // Pre-fill form with saved address
    setSavedAddress(null); // Clear display for editing
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {savedAddress && !editing ? (
        <div>
          <p><strong>Full Name:</strong> {savedAddress.full_name}</p>
          <p><strong>Street:</strong> {savedAddress.street}</p>
          <p><strong>City:</strong> {savedAddress.city}</p>
          <p><strong>State:</strong> {savedAddress.state}</p>
          <p><strong>Postal Code:</strong> {savedAddress.postal_code}</p>
          <p><strong>Country:</strong> {savedAddress.country}</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleEdit}
          >
            Edit Address
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="full_name">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={address.full_name}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none p-2"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="street">
              Address / Building No. / Street *
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none p-2"
              placeholder="Enter your address"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none p-2"
              placeholder="Enter your city"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none p-2"
              placeholder="Enter your state"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="postal_code">
              Postal Code *
            </label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={address.postal_code}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none p-2"
              placeholder="Enter your postal code"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none p-2"
              placeholder="Enter your country"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {editing ? 'Update Address' : 'Add Details'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Address;
