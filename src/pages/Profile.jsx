import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import apiHandler from "../utils/apiHandler";
import { fetchUser } from "../features/user/AuthSlice";
import Navbar from "../components/sections/Navbar";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const initialData = {
    name: user.name,
    email: user.email,
    phone: user?.phone || "",
    terms_accepted: user?.terms_accepted || false,
    profile_img: user.profile_img,
  };

  useEffect(() => {
    document.title = "Your Profile | Real Estate AI";
  }, []);

  const [previewImage, setPreviewImage] = useState(initialData.profile_img);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData,
  });

  const onSubmit = async (data) => {
    const payload = new FormData();
    payload.append("name", data.name);
    payload.append("phone", data.phone);
    payload.append("terms_accepted", data.terms_accepted);
    if (file) {
      payload.append("profile_img", file);
    }
    const res = await apiHandler("/users/me", "PUT", payload);
    if (res.success) {
      toast.success(res.message);
      dispatch(fetchUser());
    } else {
      toast.error(res.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <label htmlFor="profileUpload" className="cursor-pointer group">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  crossOrigin="anonymous"
                  className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-gray-300 group-hover:border-blue-500 transition"
                />
              ) : (
                <FaUserCircle className="text-6xl text-gray-400 mb-2 group-hover:text-blue-500 transition" />
              )}
            </label>

            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              {...register("profile_img")}
              onChange={handleImageChange}
              className="hidden"
            />

            <p className="text-sm text-gray-500">Click the picture to upload</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email (Read-Only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={initialData.email}
              readOnly
              className="w-full px-3 py-2 border bg-gray-100 rounded-lg text-gray-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("terms_accepted", {
                required: "You must accept the terms",
              })}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              I accept the{" "}
              <span className="text-blue-600 underline">
                terms and conditions
              </span>
            </label>
          </div>
          {errors.terms_accepted && (
            <p className="text-red-500 text-sm mt-1">
              {errors.terms_accepted.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Please wait..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
