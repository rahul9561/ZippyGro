import React, { createContext, useState, useContext } from 'react';

// Create Context
const ThemeContext = createContext();

// ThemeProvider to manage location and make it available to all components
const ThemeProvider = ({ children }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null); // Clear any previous errors
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <ThemeContext.Provider value={{ location, error, handleGetLocation }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use ThemeContext
const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };

