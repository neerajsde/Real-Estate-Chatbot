import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import apiHandler from "../utils/apiHandler";
import toast from "react-hot-toast";
import Navbar from "../components/sections/Navbar";

const Settings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  useEffect(() => {
    document.title = "Settings | Real Estate AI";
  }, []);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: passwordIsSubmitting },
    reset: resetPasswordForm,
  } = useForm();

  async function getUserPreferences() {
    try {
      const res = await apiHandler("/users/preference", "GET");
      if (res.success && res.data) {
        const preferences = res.data;

        reset({
          location: preferences.location || "",
          budget: preferences.budget || "",
          bedrooms: preferences.bedrooms || "",
          size_sqft: preferences.size_sqft || "",
          amenities: preferences.amenities?.join(", ") || "",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch user preferences", error);
    }
  }

  useEffect(() => {
    getUserPreferences();
  }, []);

  const onPreferencesSubmit = async (data) => {
    const amenitiesArray = data.amenities
      ? data.amenities.split(",").map((item) => item.trim())
      : [];

    const preferences = {
      ...data,
      budget: Number(data.budget),
      bedrooms: Number(data.bedrooms),
      size_sqft: Number(data.size_sqft),
      amenities: amenitiesArray,
    };
    const res = await apiHandler("/users/preference", "PUT", preferences);
    if (res.success) {
      toast.success(res.message);
      getUserPreferences();
    } else {
      toast.error(res.message);
    }
  };

  const onChangePassword = async (data) => {
    const res = await apiHandler("/users/change-password", "PUT", data);
    if (res.success) {
      toast.success(res.message);
      resetPasswordForm();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
        {/* Preferences Form */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
          <form
            onSubmit={handleSubmit(onPreferencesSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1">Location</label>
              <input
                {...register("location", { required: "Location is required" })}
                className="w-full p-2 border rounded"
                placeholder="e.g. New York"
              />
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Budget</label>
              <input
                type="number"
                {...register("budget", {
                  required: "Budget is required",
                  min: 0,
                })}
                className="w-full p-2 border rounded"
                placeholder="e.g. 1000"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm">{errors.budget.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">Bedrooms</label>
              <input
                type="number"
                {...register("bedrooms", {
                  required: "Bedrooms are required",
                  min: 1,
                })}
                className="w-full p-2 border rounded"
                placeholder="e.g. 2"
              />
              {errors.bedrooms && (
                <p className="text-red-500 text-sm">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Size (sqft)</label>
              <input
                type="number"
                {...register("size_sqft", {
                  required: "Size is required",
                  min: 100,
                })}
                className="w-full p-2 border rounded"
                placeholder="e.g. 1000"
              />
              {errors.size_sqft && (
                <p className="text-red-500 text-sm">
                  {errors.size_sqft.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Amenities (comma-separated)</label>
              <input
                {...register("amenities")}
                className="w-full p-2 border rounded"
                placeholder="e.g. Pool, Gym, Parking"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Please wait..." : "Save Preferences"}
            </button>
          </form>
        </section>

        {/* Change Password Form */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form
            onSubmit={handlePasswordSubmit(onChangePassword)}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1">Old Password</label>
              <input
                type="password"
                {...registerPassword("oldPassword", {
                  required: "Old password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className="w-full p-2 border rounded"
                placeholder="Enter old password"
              />
              {passwordErrors.oldPassword && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.oldPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">New Password</label>
              <input
                type="password"
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className="w-full p-2 border rounded"
                placeholder="Enter new password"
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordIsSubmitting}
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded"
            >
              {passwordIsSubmitting ? "Updating..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;
