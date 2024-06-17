import React, { useEffect } from "react";
import DarkLogo from "../../assets/logo-dark.png";
import LightLogo from "../../assets/logo-light.png";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItems } from "../../store/cartSlice";
import { logoutUser } from "../../store/userSlice"; // Import logoutUser action
import { FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  const dispatch = useDispatch();

  // Use useSelector to get cart state from Redux store
  const cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch cart items when the component mounts
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="w-full z-10 max-md:px-8 md:px-14 flex items-center justify-between h-[64px] bg-white dark:bg-dark">
      <div id="logo">
        <Link
          to="/"
          className="flex items-center text-2xl font-black dark:text-white font-opensans"
        >
          <img src={DarkLogo} width={40} alt="Logo" />
          <span className="max-sm:hidden text-dark">
            Cafe<span className="text-primary">teria</span>
          </span>
        </Link>
      </div>
      <div id="menu" className="flex gap-4">
        <ul className="flex items-center text-sm h-full">
          {user ? (
            <li id="menu-container" className="relative text-center">
              <Link
                className="flex items-center gap-4 px-4 py-[20px] w-full font-semibold text-dark"
                to="/profile"
              >
                <FaUser className="text-xl" />
                <span>{user.name}</span>
                <IoIosArrowDown className="absolute right-0" />
              </Link>
              <div
                id="menu"
                className="absolute w-full top-32 z-[1] bg-slate-200 hidden rounded-lg"
              >
                <Link
                  className="p-4 w-full hover:bg-primary text-center rounded-t-lg"
                  to="/profile"
                >
                  Profile
                </Link>
                <Link
                  className="p-4 w-full hover:bg-primary text-center"
                  to="/orders"
                >
                  Orders
                </Link>
                <button
                  className="p-4 w-full hover:bg-primary text-center rounded-b-lg"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </li>
          ) : (
            <Link
              className="px-4 py-2 rounded-lg text-white font-opensans font-semibold bg-primary text-center"
              to="/login"
            >
              Login
            </Link>
          )}

          <li className=" w-[100px] text-center">
            <Link
              className="p-4 flex items-center gap-1 font-opensans"
              to="/cart"
            >
              Cart{" "}
              <span
                id="count"
                className="bg-primary text-white px-2 py-1 rounded-full text-xs"
              >
                {cart.items.length}{" "}
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;