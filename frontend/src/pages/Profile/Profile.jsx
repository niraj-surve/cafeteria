import React from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaPhone, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/userSlice";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import StatusCode from "../../util/StatusCode";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  const phoneRegex = /^\d{10}$/;

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;
  const token = storedUser ? storedUser.token : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
    },
  });

  const onSubmit = (data) => {
    const { name, phone } = data;

    dispatch(updateProfile({ userId, name, phone, token }));
  };

  if (status === StatusCode.LOADING) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="md:h-[calc(100vh-64px)] max-md:p-8 md:flex justify-center items-center">
      <div className="flex gap-4 justify-center max-md:flex-col">
        <div className="md:w-[30vw] p-8 flex flex-col items-center justify-center gap-4 bg-dark text-white rounded-lg ">
          <FaUserCircle className="text-8xl" />
          <div className="flex flex-col gap-4 items-center font-mulish">
            <div className="flex flex-col items-center gap-2">
              <span>{user.name}</span>
              <span className="text-slate-400 text-sm">User</span>
            </div>
            <span>{user.email}</span>
            <span>+91 {user.phone}</span>
          </div>
        </div>
        <div
          className="h-fit p-8 rounded-lg"
          style={{ boxShadow: "0 0 5px gray" }}
        >
          <h1 className="w-full text-center text-3xl font-black font-opensans mb-8 text-dark">
            UPDATE PROFILE
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
            <div>
              <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
                <FaEnvelope className="ml-3 text-xl text-primary" />
                <input
                  className="p-2 rounded-lg outline-none text-sm w-[250px] font-mulish"
                  type="text"
                  name="email"
                  id="email"
                  defaultValue={user.email}
                  placeholder="Email"
                  disabled
                  title="Email cannot be changed!"
                />
              </div>
            </div>
            <div>
              <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
                <FaPhone className="ml-3 text-xl text-primary" />
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
            <button
              type="submit"
              className="w-full p-2 bg-primary text-white border border-primary hover:text-primary hover:bg-white rounded-lg btn-transition font-extrabold font-opensans"
            >
              UPDATE PROFILE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
