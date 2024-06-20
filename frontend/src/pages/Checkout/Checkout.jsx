import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { selectUser } from "../../store/userSlice";
import { clearCart } from "../../store/cartSlice";
import { addOrder } from "../../store/orderSlice";
import toast from "react-hot-toast";
import { getSessionKey } from "../../store/paymentSlice";
import { load } from "@cashfreepayments/cashfree-js";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");

  const cartItems = useSelector((state) => state.cart.cartItems);
  const session = useSelector((state) => state.payment.session);
  const user = useSelector(selectUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
    },
  });

  let cashfree;

  const initializeSDK = async () => {
    cashfree = await load({
      mode: "sandbox",
    });
  };

  useEffect(() => {
    initializeSDK();
  }, [session]);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;
  const token = storedUser ? storedUser.token : null;

  const onSubmit = (data) => {
    const orderData = {
      userId: userId,
      name: data.name,
      products: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      totalPrice: totalPrice,
      paymentOption: paymentMethod,
      orderDate: new Date().toISOString(),
    };

    if (paymentMethod === "cash") {
      dispatch(addOrder({ orderData, token }))
        .unwrap()
        .then(() => {
          toast.success("Order placed!", {
            position: "bottom-right",
            duration: 3000,
          });
          dispatch(clearCart({ userId, token }));
          navigate("/");
        })
        .catch((error) => {
          console.error("Failed to place order: ", error);
          toast.error("Failed to place order! Please try again.", {
            position: "bottom-right",
            duration: 3000,
          });
        });
    } else if (paymentMethod === "other") {
      let paymentData = {
        orderAmount: totalPrice,
        orderCurrency: "INR",
        customerData: {
          userId: userId,
          name: user?.name,
          phone: user?.phone,
          email: user?.email,
        },
      };

      dispatch(getSessionKey({ paymentData, token })).then((res) => {
        // Check if session is available before trying to use payment_session_id
        if (!session || !session.payment_session_id) {
          console.error("Session or payment session ID is not available.");
          toast.error("Failed to start payment process. Please try again.", {
            position: "bottom-right",
            duration: 3000,
          });
          return; // Exit early or handle gracefully
        }

        const checkoutOptions = {
          paymentSessionId: session.payment_session_id,
          redirectTarget: "_modal",
        };

        cashfree
          .checkout(checkoutOptions)
          .then((result) => {
            if (result.error) {
              console.log(
                "User has closed the popup or there is some payment error, Check for Payment Status"
              );
              console.log(result.error);
            }
            if (result.redirect) {
              console.log("Payment will be redirected");
            }
            if (result.paymentDetails) {
              console.log(
                "Payment has been completed, Check for Payment Status"
              );
              console.log(result.paymentDetails.paymentMessage);
            }
          })
          .catch((error) => {
            console.error("Failed to initiate Cashfree checkout: ", error);
            toast.error(
              "Failed to initiate payment process. Please try again.",
              {
                position: "bottom-right",
                duration: 3000,
              }
            );
          });
      }).catch(err => {
        console.log(error)
      })
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="z-0 max-w-4xl h-[calc(100vh-64px)] mx-auto px-8 py-4 flex flex-col justify-between gap-8 font-mulish"
    >
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
                      src={`/products/${item.image}`}
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
                Cash
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
                Online Payment
              </label>
            </div>
          </div>
        </div>
      </div>
      {cartItems.length > 0 ? (
        <div className="flex justify-between">
          <p className="text-xl font-bold">Total: ₹ {totalPrice}</p>
          <button
            type="submit"
            className="bg-success text-white px-4 py-2 rounded hover:bg-success focus:outline-none"
          >
            {paymentMethod === "cash" ? "Place Order" : "Go to payments"}
          </button>
        </div>
      ) : null}
    </form>
  );
};

export default Checkout;
