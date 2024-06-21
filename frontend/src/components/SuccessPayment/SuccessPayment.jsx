import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addOrder } from "../../store/orderSlice";
import { clearCart } from "../../store/cartSlice";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const SuccessPayment = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [fetchingData, setFetchingData] = useState(true); // State to control fetching

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const paymentStatus = params.get("status");

      if (paymentStatus !== "success") {
        toast.error("Payment was not successful.", {
          position: "bottom-right",
          duration: 3000,
        });
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser ? storedUser.token : null;

      try {
        const orderData = JSON.parse(localStorage.getItem("orderData"));

        if (!orderData) {
          toast.error("No order data found.", {
            position: "bottom-right",
            duration: 3000,
          });
          return;
        }

        await dispatch(addOrder({ orderData, token })).unwrap();
        localStorage.removeItem("orderData");
        toast.success("Order placed successfully!", {
          position: "bottom-right",
          duration: 3000,
        });

        dispatch(clearCart({ userId: orderData.userId, token }));
        navigate("/orders");
      } catch (error) {
        console.error("Failed to place order: ", error);
        toast.error("Failed to place order! Please try again.", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    };

    fetchData(); 
  }, [dispatch, location.search, navigate]);


  if (fetchingData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <LoadingSpinner text={"Processing Payment"} />
      </div>
    );
  }

  return null; // Or render something else if needed
};

export default SuccessPayment;