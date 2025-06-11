import React, { useState, useEffect, useRef } from "react";
import { FaSignOutAlt, FaCog, FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import apiHandler from "../../utils/apiHandler";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/user/AuthSlice";
import { useDispatch } from "react-redux";
import Loader from "../spinner/Loader";
import DefaultImg from "../../assets/default.png";

const UserMenu = ({ user }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const LogOutHandler = async () => {
    setLoading(true);
    const res = await apiHandler("/users/logout", "POST");
    if (res.success) {
      setOpen(false);
      dispatch(logout());
      navigate("/login");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Button to toggle menu */}
      <button
        onClick={toggleMenu}
        type="button"
        className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition"
      >
        {/* User Avatar */}
        <img
          src={user?.profile_img || DefaultImg }
          alt="user"
          crossOrigin="anonymous"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="hidden md:block text-sm font-medium text-gray-800">
          {user?.name}
        </span>
        <IoIosArrowDown
          className={`transition-transform duration-200 text-black ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute right-0 z-20 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ${
          open
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        <div className="py-1 text-gray-700 text-sm">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
          >
            <FaUser /> Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
          >
            <FaCog /> Settings
          </Link>
          <button
            onClick={LogOutHandler}
            className="w-full text-left cursor-pointer flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
          >
            <FaSignOutAlt className="text-red-500"/> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
