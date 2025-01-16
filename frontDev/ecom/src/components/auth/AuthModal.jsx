/** @format */

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AuthModal = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer", // Default role set to 'customer'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in username

  const apiUrl = import.meta.env.VITE_API_URL;

  // Open and Close Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate Form
  const validateForm = () => {
    const { username, email, password } = formData;

    if (!username || !password) {
      toast.error("Username and password are required!", {
        position: "top-right",
      });
      return false;
    }

    if (!isLogin && !email) {
      toast.error("Email is required for registration!", {
        position: "top-right",
      });
      return false;
    }

    return true;
  };

  // Handle Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const endpoint = isLogin ? `${apiUrl}/login/` : `${apiUrl}/register/`;

    try {
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (isLogin) {
        // Assuming the token is in the response data
        const token = response.data.access;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("username", formData.username); // Store username
        setLoggedInUser(formData.username); // Set the logged-in username
        toast.success("Login successful!", { position: "top-right" });
      } else {
        toast.success("Registration successful!", { position: "top-right" });
      }

      // Reset Form and Close Modal
      setFormData({ username: "", email: "", password: "", role: "customer" }); // Reset role to default
      closeModal();
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || "An error occurred. Please try again.";
      toast.error(errorMsg, { position: "top-right" });
      console.error("Error details:", error); // Debugging
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Login and Register Modes
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", email: "", password: "", role: "customer" }); // Reset role to default
  };

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const username = localStorage.getItem("username"); // Assuming you also store username
      setLoggedInUser(username);
    }
  }, []);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isLogin ? "Login" : "Register"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 text-xl font-bold">
                &times;
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter your username"
                  required
                />
              </div>

              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
                    placeholder="Role"
                  />
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-2 text-white rounded-md ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isLoading}>
                {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
              </button>

              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="ml-2 text-blue-500 hover:text-blue-700 font-semibold">
                    {isLogin ? "Register" : "Login"}
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}

      {loggedInUser ? (
        <h4 className="text-white">Welcome {loggedInUser}!</h4>
      ) : (
        <button
          onClick={openModal}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md">
          Login / Signup
        </button>
      )}

      <ToastContainer position="top-right" />
    </>
  );
};

export default AuthModal;
