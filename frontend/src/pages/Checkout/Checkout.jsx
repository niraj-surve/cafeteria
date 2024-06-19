import React, { useState } from "react";
import { FaMinus, FaPlus, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../../store/cartSlice";
import { useForm } from "react-hook-form";
import { selectUser } from "../../store/userSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("");

  // Use useSelector to get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector(selectUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user.name,
      address: user.address,
    },
  });

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <form className="max-w-4xl h-[calc(100vh-64px)] mx-auto px-8 py-4 flex flex-col justify-between gap-8 font-mulish">
      <h2 className="text-3xl font-bold mb-4">Checkout</h2>
      <div className="flex flex-col gap-8">
        <div className="flex gap-4">
          <div className="w-[300px] flex flex-col gap-2">
            <span className="ml-2 text-sm font-bold">Name</span>
            <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
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
          <div className="w-[300px] flex flex-col gap-2">
            <span className="ml-2 text-sm font-bold">Address</span>
            <div className="border flex items-center rounded-lg gap-2 focus-within:ring-2 ring-[#9cc4ee]">
              <input
                className="p-2 rounded-lg outline-none text-sm w-full font-mulish"
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                {...register("address", { required: "Address is required" })}
              />
            </div>
            {errors.address && (
              <span className="text-red-500 mt-2 text-sm">
                {errors.address.message}
              </span>
            )}
          </div>
        </div>
        <div className="border rounded-lg py-2 pr-3">
          <span className="ml-2 text-sm font-bold">
            Orders ({cartItems.length} items)
          </span>
          {cartItems.length > 0 && (
            <div
              id="cartMenu"
              className="h-[15vh] overflow-x-hidden overflow-y-auto px-4"
            >
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`/coffee/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-gray-600 text-sm">
                        Price: ₹ {item.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">
                    <p>Quantity</p>
                    <p>{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border p-2 rounded-lg">
          <h1 className="ml-2 mb-2 text-sm font-bold">Payment Options</h1>
          <div className="flex gap-4 items-center text-sm">
            <div
              className={`flex items-center border rounded-lg cursor-pointer ${
                paymentMethod === "cash"
                  ? "bg-primary text-white btn-transition"
                  : "bg-slate-100"
              }`}
            >
              <input
                type="radio"
                name="payment"
                id="cashPayment"
                value="cash"
                onChange={handlePaymentChange}
                className="hidden"
              />
              <label htmlFor="cashPayment" className="cursor-pointer p-2">
                Cash on Delivery (COD)
              </label>
            </div>
            <div
              className={`flex items-center border rounded-lg cursor-pointer ${
                paymentMethod === "other"
                  ? "bg-primary text-white btn-transition"
                  : "bg-slate-100"
              }`}
            >
              <input
                type="radio"
                name="payment"
                id="otherPayment"
                value="other"
                onChange={handlePaymentChange}
                className="hidden"
              />
              <label htmlFor="otherPayment" className="cursor-pointer p-2">
                UPI or Card
              </label>
            </div>
          </div>
        </div>
      </div>
      {cartItems.length > 0 ? (
        <div className="flex justify-between">
          <p className="text-xl font-bold">Total: ₹ {totalPrice}</p>
          <Link to={"/cart/checkout"}>
            <button className="bg-success text-white px-4 py-2 rounded hover:bg-success focus:outline-none">
              {paymentMethod === "cash" ? "Place Order" : "Go to payments"}
            </button>
          </Link>
        </div>
      ) : null}
    </form>
  );
};

export default Checkout;
