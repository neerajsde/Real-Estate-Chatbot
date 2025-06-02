import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import PropertyCard from "../property/PropertyCard"; // adjust path as needed
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="absolute z-10 right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      onClick={onClick}
    >
      <FaChevronRight size={20} />
    </button>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="absolute z-10 left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      onClick={onClick}
    >
      <FaChevronLeft size={20} />
    </button>
  );
}

export default function MostSearchedCarousel({ properties }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      {properties.length > 0 && (
        <div className="w-full py-8 px-4 md:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Most Searched Properties</h2>
            <p className="text-gray-500">Suggested for you</p>
          </div>
          <Slider {...settings}>
            {properties.map((item, idx) => (
              <div key={idx} className="px-2">
                <PropertyCard item={item} />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  );
}
