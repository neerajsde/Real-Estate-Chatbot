import React, { useState, useEffect } from "react";
import { FaSearchLocation, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/sections/Navbar";
import { useDispatch } from "react-redux";
import {openChat} from '../features/chat/chatSlice';
import apiHandler from "../utils/apiHandler";
import MostSearchedCarousel from "../components/common/MostSearchedCarousel";

const images = [
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
];

const Home = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    document.title = "Real Estate AI - Smart Property Finder";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(properties.length === 0){
      getMostSearchedProperty();
    }
  },[])

  async function getMostSearchedProperty() {
    const res = await apiHandler('/property/most-searched', 'GET');
    if(res.success){
      setProperties(res.data);
    }
  }

  return (
    <div className="w-full flex flex-col">
        <div className="relative w-full h-screen overflow-hidden text-white">
        {/* Background image slideshow */}
        <Navbar/>
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            filter: "brightness(0.6)",
          }}
        />

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Find Your Dream Property
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl drop-shadow-md">
            Explore apartments, villas, condos, and more tailored to your preferences — powered by AI.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to='/filters' className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2 transition-all">
              <FaSearchLocation /> Start Finding
            </Link>
            <button onClick={() => dispatch(openChat())} className="bg-white cursor-pointer text-blue-600 hover:text-blue-700 px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2 transition-all">
              <FaComments /> Chat with Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Most Searched */}
      {properties.length > 0 && (<MostSearchedCarousel properties={properties}/>)}
    </div>
  );
};

export default Home;
