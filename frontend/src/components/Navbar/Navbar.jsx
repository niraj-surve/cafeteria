import React, { useEffect } from "react";
import DarkLogo from "../../assets/logo-dark.png";
import LightLogo from "../../assets/logo-light.png";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector and useDispatch
import { fetchCartItems } from "../../store/cartSlice"; // Import fetchCartItems action

const Navbar = () => {
  const user = {
    name: "John",
  };

  const dispatch = useDispatch(); // Initialize useDispatch hook

  // Use useSelector to get cart state from Redux store
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    // Fetch cart items when the component mounts
    dispatch(fetchCartItems());
  }, [dispatch]);

  const logout = () => {};

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
      <div id="menu" className="flex items-center gap-4">
        <ul className="flex items-center text-sm">
          {user ? (
            <li id="menu-container" className="relative w-[100px] text-center">
              <Link className="p-4 w-full inline-block" to="/profile">
                {user.name}
              </Link>
              <div id="menu" className="absolute z-[1] bg-slate-200 hidden">
                <Link
                  className="p-4 hover:bg-primary w-[100px] text-center"
                  to="/profile"
                >
                  Profile
                </Link>
                <Link
                  className="p-4 hover:bg-primary w-[100px] text-center"
                  to="/orders"
                >
                  Orders
                </Link>
                <button
                  className="p-4 hover:bg-primary w-[100px] text-center"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </li>
          ) : (
            <Link
              className="p-4 hover:bg-primary w-[100px] text-center"
              to="/login"
            >
              Login
            </Link>
          )}

          <li className=" w-[100px] text-center">
            <Link className="p-4 flex items-center gap-1" to="/cart">
              Cart{" "}
              <span
                id="count"
                className="bg-primary text-white px-2 py-1 rounded-full text-xs"
              >
                {cart.items.length}{" "}
                {/* Display cart items length dynamically */}
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;