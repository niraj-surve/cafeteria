import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/userSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user, status } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = (data) => {
    dispatch(loginUser(data));
    reset();
  };

  useEffect(() => {
    if (status === "succeeded" && user) {
      const returnUrl = searchParams.get("returnurl") || "/";
      navigate(returnUrl); // Navigate to returnUrl after successful login
    }
  }, [status, user, navigate, searchParams]);

  return (
    <div className="h-[calc(100vh-64px)] max-md:px-8 flex items-center justify-center">
      <div className="p-8 rounded-lg" style={{ boxShadow: "0 0 5px gray" }}>
        <h1 className="w-full text-center text-3xl font-black font-opensans mb-8 text-dark">
          LOG IN
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
          autoComplete="off"
        >
          <div>
            <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
              <FaUser className="ml-3 text-xl text-primary" />
              <input
                className="p-2 rounded-lg outline-none text-sm w-[250px] font-mulish"
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                {...register("email", {
                  validate: validateEmail,
                })}
              />
            </div>
            {errors.email && (
              <span id="email-error" className="text-red-500 mt-2 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
              <FaLock className="ml-3 text-xl text-primary" />
              <input
                className="p-2 rounded-lg outline-none text-sm w-[250px] font-mulish"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                {...register("password", {
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
              <span id="password-error" className="text-red-500 mt-2 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-primary text-white border border-primary hover:text-primary hover:bg-white rounded-lg btn-transition font-extrabold font-opensans"
          >
            LOGIN
          </button>
        </form>
        <span className="block text-sm text-center w-full mt-8 text-primary">Don't have any account? <Link to={"/register"} className="hover:text-dark">Register Now</Link></span>
      </div>
    </div>
  );
};

export default Login;