import React, { useEffect, useState } from "react";
import PropertyCard from "../components/property/PropertyCard";
import { useDispatch, useSelector } from "react-redux";
import { openChat } from "../features/chat/chatSlice";
import { FaRegLightbulb } from "react-icons/fa6";
import { BiSad } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import Navbar from "../components/sections/Navbar";
import apiHandler from "../utils/apiHandler";

const Recommended = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getRecommendPropertiesByUserPreference();
  }, []);

  useEffect(() => {
    document.title = "Recommended Properties Just for You | Real Estate AI";
  }, []);

  async function getRecommendPropertiesByUserPreference() {
    const loadFromLocalStorage = () => {
      const data = localStorage.getItem("RecommendedProperties");
      if (data) {
        setProperties(JSON.parse(data));
        return true;
      }
      return false;
    };

    if (!isAuthenticated) {
      if (!loadFromLocalStorage()) {
        dispatch(openChat());
      }
      return;
    }

    try {
      const res = await apiHandler("/chats/search/me", "POST", {});
      if (res.success) {
        localStorage.setItem("RecommendedProperties", JSON.stringify(res.data));
        setProperties(res.data);
      } else {
        if (!loadFromLocalStorage()) {
          dispatch(openChat());
        }
      }
    } catch (error) {
      if (!loadFromLocalStorage()) {
        dispatch(openChat());
      }
    }
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="w-full h-[90vh] flex flex-col justify-center items-center text-gray-600 text-center px-4">
          <BiSad className="text-5xl mb-2 text-red-400" />
          <p className="text-lg font-medium">
            No properties match your filters.
          </p>
          <p className="text-sm">Let me help you find something better.</p>
          <button
            onClick={() => dispatch(openChat())}
            className="flex items-center gap-2 mt-6 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            <FaSearch className="text-white" />
            Start Finding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-gray-100">
      <Navbar />
      <div className="text-center my-6 px-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 text-indigo-700">
          <FaRegLightbulb className="text-yellow-400" /> Recommended For You
        </h1>
        <p className="text-gray-500 mt-1">Based on your recent preferences</p>
      </div>

      <div className="w-full mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8">
        {properties.map((item, index) => (
          <div key={index} className="transition-transform hover:scale-[1.02]">
            <PropertyCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommended;
