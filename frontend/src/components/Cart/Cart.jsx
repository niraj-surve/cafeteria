import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItems,
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../../store/cartSlice";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { items = [], status, error } = cart;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCartItems());
    }
  }, [status, dispatch]);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleIncrement = (itemId) => {
    const itemToUpdate = items.find((item) => item.id === itemId);
    if (itemToUpdate) {
      const newQuantity = itemToUpdate.quantity + 1;
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleDecrement = (itemId) => {
    const itemToUpdate = items.find((item) => item.id === itemId);
    if (itemToUpdate && itemToUpdate.quantity > 1) {
      const newQuantity = itemToUpdate.quantity - 1;
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  // Ensure items is always an array before using reduce
  const totalPrice = Array.isArray(items)
    ? items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-4">Shopping Cart</h2>
        <button
          onClick={handleClearCart}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
        >
          Clear Cart
        </button>
      </div>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>{error}</p>}
      {Array.isArray(items) && items.length === 0 ? (
        <div className="relative top-40 flex flex-col items-center gap-4">
          <p className="text-center font-mulish text-xl">Your cart is empty!</p>
          <Link to={"/"}>
            <button className="bg-success w-fit px-3 py-2 rounded-lg text-white font-opensans border border-success hover:bg-white hover:text-success btn-transition">
              Explore Products
            </button>
          </Link>
        </div>
      ) : (
        <div>
          {Array.isArray(items) &&
            items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-300 py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={`/coffee/${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-gray-600">Price: ₹ {item.price}</p>
                    <div className="flex gap-2 items-center mt-2">
                      <button
                        onClick={() => handleDecrement(item.id)}
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
                        onClick={() => handleIncrement(item.id)}
                        className="bg-white border p-2 rounded-r"
                      >
                        <FaPlus className="text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 font-semibold focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ))}
          <div className="flex justify-between mt-4">
            <p className="text-xl font-bold">Total: ₹ {totalPrice}</p>
            <button className="bg-success text-white px-4 py-2 rounded hover:bg-success focus:outline-none">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
