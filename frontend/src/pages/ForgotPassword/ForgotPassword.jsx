import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, loginUser } from "../../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import StatusCode from "../../util/StatusCode";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email should not be empty";
  } else if (!re.test(String(email).toLowerCase())) {
    return "Invalid email address";
  }
  return true;
};

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, status } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  
  const onSubmit = (data) => {
    dispatch(forgotPassword(data.email)).then(result => {
        if (
          result.payload &&
          result.payload.message.status === 200
        ) {
          reset();
          navigate("/login");
        }
    });
    reset();
  };

  if (status === StatusCode.LOADING) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] max-md:px-4 flex items-center justify-center">
      <div className="p-8 rounded-lg" style={{ boxShadow: "0 0 5px gray" }}>
        <h1 className="w-full text-center max-md:text-xl text-3xl font-black font-opensans mb-8 text-dark">
          FORGOT PASSWORD
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
                className="p-2 rounded-lg outline-none text-sm w-full font-mulish"
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
          <button
            type="submit"
            className="w-full p-2 bg-primary text-white border border-primary hover:text-primary hover:bg-white rounded-lg btn-transition font-extrabold font-opensans"
          >
            SUBMIT
          </button>
        </form>
        <div className="w-full text-sm text-right mt-4 text-primary hover:text-dark">
          <Link to={"/login"}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;