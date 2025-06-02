import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import apiHandler from "../utils/apiHandler";
import { useDispatch } from "react-redux";
import { fetchUser } from "../features/user/AuthSlice";
import Navbar from "../components/sections/Navbar";

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | Real Estate AI";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    let response = await apiHandler("/users/login", "POST", data);
    if (response.success) {
      dispatch(fetchUser());
      toast.success(response.message);
      navigate("/");
      reset();
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="w-full min-h-[90vh] flex items-center justify-center bg-gray-50 p-4 py-8">
        <div className="w-[400px] bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2">Login</h2>

          {/* "Don't have an account?" line */}
          <p className="text-center text-sm text-gray-600 mb-6">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/signup"
              className="text-purple-600 font-medium hover:underline cursor-pointer"
            >
              Sign Up
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Address Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full px-3 py-2 border rounded-md outline-none placeholder-gray-400 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:border-purple-500`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2 border rounded-md outline-none placeholder-gray-400 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:border-purple-500`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 cursor-pointer flex items-center text-gray-500 hover:text-gray-700"
                  tabIndex={
                    -1
                  } /* so that button does not steal focus from input */
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 cursor-pointer text-white uppercase font-semibold py-2 rounded-md hover:bg-purple-700 transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
