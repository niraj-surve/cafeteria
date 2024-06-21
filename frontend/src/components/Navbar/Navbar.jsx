import React, { useEffect } from "react";
import DarkLogo from "../../assets/logo-dark.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import toast from "react-hot-toast";
import { getCartItems, resetCartState } from "../../store/cartSlice";
import { fetchOrders } from "../../store/orderSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use useSelector to get user state from Redux store
  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;
  const token = storedUser ? storedUser.token : null;

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetCartState());
    navigate("/")
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/cart");
    } else {
      toast.error("Please login to access cart", {
        position: "bottom-right",
        duration: 3000,
      });
      navigate("/login?returnurl=/cart");
    }
  };

  useEffect(() => {
    if (userId && token) {
      dispatch(getCartItems({ userId, token }));
      dispatch(fetchOrders({userId, token}))
    }
  }, [dispatch, userId, token]);

  return (
    <div className="w-full z-10 max-md:px-8 md:px-14 flex items-center justify-between h-[64px] bg-white dark:bg-dark">
      <div id="logo">
        <Link
          to="/"
          className="flex items-center text-2xl font-black dark:text-white font-opensans"
        >
          <img src={DarkLogo} width={50} alt="Logo" />
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
                <FaUser className="text-xl text-primary" />
                <span className="mr-2">{user.name.split(' ')[0]}</span>
                <IoIosArrowDown className="absolute right-0" />
              </Link>
              <div
                id="menu"
                className="absolute w-full top-32 z-[1] bg-slate-200 hidden rounded-lg"
              >
                <Link
                  className="p-4 w-full hover:bg-primary hover:text-white btn-transition text-center rounded-t-lg"
                  to="/profile"
                >
                  Profile
                </Link>
                <Link
                  className="p-4 w-full hover:bg-primary hover:text-white btn-transition text-center"
                  to="/orders"
                >
                  Orders
                </Link>
                <button
                  className="p-4 w-full hover:bg-primary hover:text-white btn-transition text-center rounded-b-lg"
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

          <li className="w-[100px] text-center">
            <button
              className="p-4 flex items-center gap-1 font-opensans"
              onClick={handleCartClick}
            >
              Cart{" "}
              <span
                id="count"
                className="bg-primary text-white px-2 py-1 rounded-full text-xs"
              >
                {cartItems.length}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;