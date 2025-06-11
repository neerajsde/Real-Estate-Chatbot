import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PropertyCard from "../components/property/PropertyCard";
import { FaHeartBroken, FaBookmark, FaTrash } from "react-icons/fa";
import { FaSearchLocation } from "react-icons/fa";
import {
  removeFromWishlist,
  clearWishlist,
} from "../features/wishlist/wishlistSlice";
import toast from "react-hot-toast";
import Navbar from "../components/sections/Navbar";

const SavedProperties = () => {
  const dispatch = useDispatch();
  const properties = useSelector((state) => state.wishlist.items);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.success("Removed from wishlist!");
  };

  useEffect(() => {
    document.title = "Your Saved Properties | Real Estate AI";
  }, []);

  const handleClear = () => {
    dispatch(clearWishlist());
  };

  if (properties.length === 0) {
    return (
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="w-full flex h-[90vh] flex-col items-center justify-center text-gray-600">
          <FaHeartBroken className="text-6xl text-red-400 mb-4" />
          <p className="text-xl font-medium">No saved properties yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Start exploring and save your favorite homes!
          </p>
          <Link
            to="/filters"
            className="bg-blue-600 mt-6 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2 transition-all"
          >
            <FaSearchLocation /> Start Finding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="p-6 md:p-10 lg:p-12">
        {/* Heading + Clear Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-1 md:gap-2">
            <FaBookmark className="text-2xl text-blue-600" />
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
              Saved Properties
            </h2>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-sm px-2 md:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            <FaTrash /> Clear All
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((item) => (
            <div key={item.id || item._id} className="relative">
              <PropertyCard item={item} />
              <button
                onClick={() => handleRemove(item.id || item._id)}
                className="absolute top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedProperties;
