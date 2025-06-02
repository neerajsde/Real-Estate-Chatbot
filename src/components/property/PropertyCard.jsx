import React from "react";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaHeart,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../features/wishlist/wishlistSlice";
import toast from "react-hot-toast";

const PropertyCard = ({ item }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  const alreadyInWishlist = wishlist.some((i) => i.id === item.id);

  const handleWishlist = () => {
    if (!alreadyInWishlist) {
      dispatch(addToWishlist(item));
      toast.success('added to wishlist')
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      <div className="relative">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-48 object-cover"
        />

        {/* Save to wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 cursor-pointer bg-white p-2 rounded-full shadow transition group ${
            alreadyInWishlist ? "cursor-not-allowed opacity-70" : "hover:bg-red-100"
          }`}
          title={alreadyInWishlist ? "Already in Wishlist" : "Save to Wishlist"}
          disabled={alreadyInWishlist}
        >
          <FaHeart
            className={`text-xl ${
              alreadyInWishlist ? "text-red-500" : "text-gray-600 group-hover:text-red-500"
            } transition duration-200`}
          />
        </button>

        {/* Property info overlay */}
        <div className="absolute top-0 left-0 p-2 pr-4 rounded-br-2xl flex flex-col gap-2 bg-[#00000081] text-sm text-gray-100">
          <div className="flex items-center gap-1">
            <FaBed />
            <span>{item.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBath />
            <span>{item.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRulerCombined />
            <span>{item.size_sqft} sqft</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>

        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-gray-500 text-sm">
            <FaMapMarkerAlt className="mr-1" />
            <span>{item.location}</span>
          </div>

          <div className="text-lg text-blue-600 font-bold">
            ₹{item.price.toLocaleString()}
          </div>
        </div>

        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Amenities:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {item.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
