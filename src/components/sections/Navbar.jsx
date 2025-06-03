import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import UserMenu from "../common/UserMenu";
import { FaRegHeart } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const SavedProperties = useSelector((state) => state.wishlist.items);
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const navLinkStyle = isHomePage
    ? "text-white hover:text-gray-300"
    : "text-gray-800 hover:text-blue-600";

  return (
    <div
      className={`w-full px-4 py-3 sticky top-0 z-50 transition-all duration-300 ${
        isHomePage ? "bg-transparent" : "bg-white shadow"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo and App Name */}
        <Link
          to="/"
          className="flex items-center hover:opacity-90 transition duration-300"
        >
          <img
            src={Logo}
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            className={`text-xl font-semibold tracking-wide ml-2 ${
              isHomePage ? "text-white" : "text-gray-800"
            }`}
          >
            Real Estate AI
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/filters" className={navLinkStyle}>
            Filters
          </Link>
          <Link to="/recommended" className={navLinkStyle}>
            Recommended Properties
          </Link>
        </div>

        {/* Right: Authenticated UserMenu or Login/Signup */}
        <div className="flex items-center gap-4">
          <Link to="/saved-properties" className="relative inline-block">
            <FaRegHeart
              className={`text-3xl ${
                isHomePage ? "text-white" : "text-gray-600"
              }`}
            />
            {SavedProperties.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {SavedProperties.length}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-medium rounded-md border transition ${
                  isHomePage
                    ? "text-white border-white hover:bg-white hover:text-black"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  isHomePage
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
