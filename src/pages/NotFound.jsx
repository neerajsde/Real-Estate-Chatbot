import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found | Real Estate AI";
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <FaExclamationTriangle className="text-yellow-500 text-6xl mb-4" />

      <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-4">Oops! Page not found.</p>
      <p className="text-gray-500 text-center max-w-md mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
