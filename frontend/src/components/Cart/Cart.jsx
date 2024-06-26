import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../../store/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;
  const token = storedUser ? storedUser.token : null;

  const handleRemoveItem = (userId, itemId, token) => {
    if (userId && token) {
      dispatch(removeFromCart({ userId, itemId, token }));
    }
  };

  const handleClearCart = (userId, token) => {
    if (userId && token) {
      dispatch(clearCart({ userId, token }));
    }
  };

  const handleIncrement = (userId, itemId, token) => {
    if (userId && token) {
      dispatch(incrementQuantity({ userId, itemId, token }));
    }
  };

  const handleDecrement = (userId, itemId, token) => {
    if (userId && token) {
      dispatch(decrementQuantity({ userId, itemId, token }));
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="max-w-4xl h-[calc(100vh-64px)] mx-auto p-8 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl max-md:text-2xl font-bold mb-4">
          Shopping Cart
        </h2>
        {cartItems.length > 0 && (
          <button
            onClick={() => handleClearCart(userId, token)}
            className="text-sm bg-red-500 text-white px-4 py-2 max-md:text-sm rounded border border-red-600 hover:bg-white btn-transition hover:text-red-600 focus:outline-none"
          >
            Clear Cart
          </button>
        )}
      </div>
      <div>
        {cartItems.length === 0 ? (
          <div className="relative top-40 flex flex-col items-center gap-4">
            <p className="text-center font-mulish text-xl">
              Your cart is empty!
            </p>
            <Link to={"/"}>
              <button className="bg-primary w-fit px-3 py-2 rounded-lg text-white font-opensans border border-primary hover:bg-white hover:text-primary btn-transition">
                Explore Products
              </button>
            </Link>
          </div>
        ) : (
          <div
            id="cartMenu"
            className="max-md:self-end md:h-[50vh] overflow-x-hidden overflow-y-auto px-4"
          >
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-300 py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={`/products/${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-gray-600">Price: ₹ {item.price}</p>
                    <div className="flex gap-2 items-center mt-2">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? handleDecrement(userId, item.productId, token)
                            : null
                        }
                        className="bg-white border p-2 rounded-l"
                      >
                        <FaMinus className="text-primary" />
                      </button>
                      <input
                        type="number"
                        readOnly
                        value={item.quantity}
                        className="border border-gray-300 rounded p-1 text-center w-16 focus:outline-none cursor-default"
                      />
                      <button
                        onClick={() =>
                          handleIncrement(userId, item.productId, token)
                        }
                        className="bg-white border p-2 rounded-r"
                      >
                        <FaPlus className="text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleRemoveItem(userId, item.productId, token)
                  }
                  className="text-sm text-red-500 font-semibold focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {cartItems.length > 0 ? (
        <div className="flex justify-between max-md:absolute max-md:bottom-4 max-md:w-[85vw]">
          <p className="text-xl font-bold">Total: ₹ {totalPrice}</p>
          <Link to={"/cart/checkout"}>
            <button className="text-sm bg-success text-white px-4 py-2 rounded hover:bg-white border border-success hover:text-success focus:outline-none btn-transition">
              Checkout
            </button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default Cart;
