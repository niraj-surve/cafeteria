import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../store/userSlice";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email should not be empty";
  } else if (!re.test(String(email).toLowerCase())) {
    return "Invalid email address";
  }
  return true;
};

const validatePassword = (password) => {
  if (!password) {
    return "Password should not be empty";
  } else if (password.length < 8) {
    return "Password must be at least 8 characters";
  } else if (password.length > 16) {
    return "Password must not exceed 16 characters";
  }
  return true;
};

const phoneRegex = /^\d{10}$/;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = (data) => {
    const { confirmPassword, ...formData } = data;
    dispatch(registerUser(formData)).then((result) => {
      if (
        result.payload &&
        result.payload.message === "User registered successfully!"
      ) {
        reset(); 
        navigate("/login");
      }
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] max-md:px-8 flex items-center justify-center">
      <div className="p-8 rounded-lg" style={{ boxShadow: "0 0 5px gray" }}>
        <h1 className="w-full text-center text-3xl font-black font-opensans mb-8 text-dark">
          REGISTER
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
          autoComplete="off"
        >
          <div className="flex gap-4 max-md:flex-col">
            <div className="w-full">
              <div className="border max-md:mb-4 flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
                <FaUser className="ml-3 text-xl text-primary" />
                <input
                  className="p-2 rounded-lg outline-none text-sm w-full font-mulish"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && (
                <span className="text-red-500 mt-2 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="w-full">
              <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
                <FaEnvelope className="ml-3 text-xl text-primary" />
                <input
                  className="p-2 rounded-lg outline-none text-sm w-full font-mulish"
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    validate: validateEmail,
                  })}
                />
              </div>
              {errors.email && (
                <span className="text-red-500 mt-2 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-4 max-md:flex-col">
            <div className="w-full">
              <div className="border max-md:mb-4 flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
                <FaPhoneAlt className="ml-3 text-xl text-primary" />
                <input
                  className="p-2 rounded-lg outline-none text-sm w-full font-mulish"
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Phone"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: phoneRegex,
                      message: "Invalid phone number",
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <span className="text-red-500 mt-2 text-sm">
                  {errors.phone.message}
                </span>
              )}
            </div>
            <div className="w-full">
              <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
                <FaLock className="ml-3 text-xl text-primary" />
                <input
                  className="p-2 rounded-lg outline-none text-sm w-full font-mulish"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    validate: validatePassword,
                  })}
                />
                {showPassword ? (
                  <FaEyeSlash
                    className="relative right-2 text-xl text-dark cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="relative right-2 text-xl text-dark cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
              {errors.password && (
                <span className="text-red-500 mt-2 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
                <FaLock className="ml-3 text-xl text-primary" />
                <input
                  className="p-2 rounded-lg outline-none text-sm w-full font-mulish"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                {showConfirmPassword ? (
                  <FaEyeSlash
                    className="relative right-2 text-xl text-dark cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="relative right-2 text-xl text-dark cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 mt-2 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-primary text-white border border-primary hover:text-primary hover:bg-white rounded-lg btn-transition font-extrabold font-opensans"
          >
            REGISTER
          </button>
        </form>
        <span className="block text-sm text-center w-full mt-8 text-primary">
          Already have an account?{" "}
          <Link to={"/login"} className="hover:text-dark">
            Login Now
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
