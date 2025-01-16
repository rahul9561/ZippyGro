import React, { useState, useEffect } from 'react';
import { useTheme } from '../project/Findcurrent';

const FindAndDisplayLocation = () => {
  const { location, error, handleGetLocation } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [address, setAddress] = useState('');

  // Automatically open the modal on page load
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  // Fetch address using PositionStack API
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `http://api.positionstack.com/v1/reverse?access_key=4e13e134f2c3be932f92f0a9ef19f978&query=${latitude},${longitude}`
      );
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setAddress(data.data[0].label); // Use the 'label' field for a full address
      } else {
        setAddress('Unable to fetch address.');
      }
    } catch (err) {
      setAddress('Error fetching address.');
      console.error('PositionStack Error:', err);
    }
  };

  // Trigger geocoding whenever location updates
  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchAddress(location.latitude, location.longitude);
    }
  }, [location]);

  return (
    <>
      {/* Modal for Find Location */}
      {isModalOpen && (
        <div className="fixed inset-0   bg-gray-800 bg-opacity-75 flex items-center justify-center z-50" style={{left:"-17px"}}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white-800">Find Your Location</h2>
              <button
                className="text-white-500 hover:text-white-700"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <p className="text-sm text-white-600 mt-2">
              Please allow location access to fetch your current coordinates.
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  handleGetLocation();
                  setIsModalOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <i className="fa-solid fa-location-dot text-white mr-2"></i>
                Find Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Display Location */}
        <div className="text-center">
          {location.latitude && location.longitude ? (
            <div className="text-white">
              <h2 className="text-lg font-semibold text-white-800">Your Location:</h2>
              {/* <p className="text-sm text-white-600">
                <i className="fa-solid fa-location-dot text-white mr-2"></i> Latitude: {location.latitude}
              </p>
              <p className="text-sm text-white-600">
                Longitude: {location.longitude}
              </p> */}
              <p className="text-sm text-white-600">
               <i className="fa-solid fa-location-dot text-xl text-red-500"></i>   Address: {address || 'Fetching address...'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-white-500">No location available.</p>
          )}

          {/* Display Error if Any */}
          {error && (
            <div className="text-red-500 mt-2">
              <p>Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FindAndDisplayLocation;
