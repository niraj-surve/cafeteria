import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../store/userSlice";

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

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resetToken } = useParams();

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
    dispatch(resetPassword({ resetToken, newPassword: data.password })).then(
      (result) => {
        if (
          result.payload &&
          result.payload.message === "Password has been reset"
        ) {
          reset();
          navigate("/login");
        }
      }
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] max-md:px-8 max-md:py-10 flex items-center justify-center">
      <div className="p-8 rounded-lg" style={{ boxShadow: "0 0 5px gray" }}>
        <h1 className="w-full max-md:text-xl text-center text-3xl font-black font-opensans mb-8 text-dark">
          RESET PASSWORD
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
          autoComplete="off"
        >
          <div className="w-full">
            <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
              <FaLock className="ml-3 text-xl text-primary" />
              <input
                className="p-2 rounded-lg outline-none text-sm w-full font-mulish"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="New Password"
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
          <div className="w-full">
            <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
              <FaLock className="ml-3 text-xl text-primary" />
              <input
                className="p-2 rounded-lg outline-none text-sm w-full font-mulish"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm New Password"
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
          <button
            type="submit"
            className="w-full p-2 bg-primary text-white border border-primary hover:text-primary hover:bg-white rounded-lg btn-transition font-extrabold font-opensans"
          >
            RESET PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;