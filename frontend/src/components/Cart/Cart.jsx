import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Cart = () => {
  const dispatch = useDispatch();

  // Use useSelector to get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleRemoveItem = (itemId) => {
    // dispatch(removeItemFromCart(itemId));
  };

  const handleClearCart = () => {
    // dispatch(clearCart());
  };

  const handleIncrement = (itemId) => {
    // dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId) => {
    // dispatch(decrementQuantity(itemId));
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

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
      <div>
        {cartItems.length === 0 ? (
          <div className="relative top-40 flex flex-col items-center gap-4">
            <p className="text-center font-mulish text-xl">
              Your cart is empty!
            </p>
            <Link to={"/"}>
              <button className="bg-success w-fit px-3 py-2 rounded-lg text-white font-opensans border border-success hover:bg-white hover:text-success btn-transition">
                Explore Products
              </button>
            </Link>
          </div>
        ) : (
          <div>
            {cartItems.map((item, index) => (
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
    </div>
  );
};

export default Cart;