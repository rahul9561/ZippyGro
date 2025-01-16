/** @format */
import Logo from '../assets/zippygro-logo.png'
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation } from "react-router-dom";
import FindAndDisplayLocation from "./findLocationsbutton/FindAndDisplayLocation";
import Category from "./project/Category";
import Searchbar from "./project/Searchbar";
import Login from "./auth/AuthModal";

const Navbar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  const location = useLocation();
  const isSearchPage = location.pathname.includes("/search");

  return (
    <>
      <ToastContainer />

      <nav className="shadow-md mb-4 bg-green-700">
        {/* Mobile View */}
        <div className="md:hidden">
          {/* Search Bar (Fixed Section) */}
          <div className="fixed top-0 left-0 w-full bg-green-700 z-50 shadow-lg">
            <div className="flex justify-between items-center p-4">
              {/* Live Location and Login */}
              <div className="flex items-center space-x-4">
                <Login />
                <FindAndDisplayLocation />
              </div>
            </div>
            {/* Search Input */}
            <div className="px-4 pb-4">
              {!isSearchPage ? (
                <Searchbar />
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Products"
                    className="py-3 pl-6 w-full pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    className="bg-blue-500 absolute top-0 right-0 h-full text-white px-4 rounded-r-lg hover:bg-blue-600"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Other Content (Scrollable) */}
          <div className="pt-[120px]"> {/* Adjust padding to prevent overlap */}
            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around py-2 border-t border-gray-200">
              <Link to="/" className="flex flex-col items-center text-green-700">
                <i className="fa-solid fa-home text-xl"></i>
                <span className="text-sm">Home</span>
              </Link>
              <Link
                to="/categories"
                className="flex flex-col items-center text-green-700"
              >
                <i className="fa-solid fa-th-large text-xl"></i>
                <span className="text-sm">Categories</span>
              </Link>
              <Link
                to="/cart"
                className="flex flex-col items-center text-green-700"
              >
                <i className="fa-solid fa-shopping-cart text-xl"></i>
                <span className="text-sm">Cart</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              {/* Logo and Live Location */}
              <div className="flex items-center space-x-4">
                <Category />
                <Link to="/" className="flex items-center space-x-1">
                <img src={Logo} alt="" style={{width:"100px"}} />
                </Link>
                <FindAndDisplayLocation />
              </div>

              {/* Desktop Menu */}
              <div className="flex items-center space-x-6">
                {!isSearchPage && <Searchbar />}

                <div className="flex items-center space-x-4">
                  <Login />
                  <Link
                    to="/cart"
                    className="p-3 text-white tp-header-action-5 hover:bg-blue-600 flex items-center justify-center"
                    title="addtocart"
                  >
                    <i className="fa-solid fa-cart-plus text-xl"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
