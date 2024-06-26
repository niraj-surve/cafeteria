import React from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="top-0 w-full h-screen z-[-1] flex flex-col gap-4 justify-center items-center">
      <h1 className="text-dark max-md:text-8xl md:text-[10rem] font-black font-opensans">Oops!</h1>
      <h3 className="uppercase text-primary font-extrabold text-xl max-md:text-lg">
        404 - Page Not Found
      </h3>
      <Link to={"/"}>
        <button className="flex gap-2 items-center md:text-lg font-bold border btn-transition border-success text-white bg-success hover:bg-white hover:text-success px-3 py-2 rounded-lg">
          <FaHome className="md:text-xl" />
          <span>Go to Homepage</span>
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
