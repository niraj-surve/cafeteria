import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cancelOrder, getOrderById } from "../../store/orderSlice";
import StatusCode from "../../util/StatusCode";
import toast from "react-hot-toast";

const Order = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, order } = useSelector((state) => state.orders);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;
  const token = storedUser ? storedUser.token : null;

  const handleCancelOrder = (orderId) => {
    dispatch(cancelOrder({ userId, orderId, token })).then((result) => {
      if (result.payload === orderId) {
        toast.success("Order cancelled successfully!", {
          position: "bottom-right",
          duration: 3000,
        });
        toast.success("Refund will be done within 24 hours!", {
          position: "bottom-right",
          duration: 3000,
        });
        navigate("/orders")
      }
    });
  };

  useEffect(() => {
    const fetchOrder = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id;
      const token = storedUser?.token;

      if (orderId && userId && token) {
        dispatch(getOrderById({ userId, orderId, token }));
      }
    };

    fetchOrder();
  }, [dispatch, orderId]);

  if (status === StatusCode.LOADING) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (status === StatusCode.ERROR) {
    return <div className="text-center mt-4">Error: {error}</div>;
  }

  if (!order || !order.products) {
    return (
      <div className="text-center mt-4">
        Order not found or products not available.
      </div>
    );
  }

  return (
    <div className="px-14 py-8 md:h-[calc(100vh-64px)] max-md:gap-4 flex flex-col justify-between">
      <h1 className="text-3xl font-bold mb-4 text-dark font-opensans">
        Order Details
      </h1>
      <div className="md:h-[50vh] max-md:p-4 bg-white rounded-lg font-mulish text-sm grid grid-cols-2 max-md:grid-cols-1 max-md:gap-4 border place-items-center">
        <div className="flex flex-col gap-4">
          <p className="mb-2">
            <span className="font-bold">Order ID:</span> {order.orderId}
          </p>
          <p className="mb-2">
            <span className="font-bold">Receiver Name:</span> {order.name}
          </p>
          <p className="mb-2">
            <span className="font-bold">Status:</span> {order.status}
          </p>
          <p className="mb-2">
            <span className="font-bold">Payment:</span>{" "}
            {order.paymentOption === "cash"
              ? `Cash (${order.paymentStatus})`
              : `Online Payment (${order.paymentStatus})`}
          </p>
          <p className="mb-2">
            <span className="font-bold">Order Date:</span>{" "}
            {new Date(order.orderDate).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">Products</h2>
          <div>
            <ul
              className="overflow-x-hidden overflow-y-auto h-[24vh] flex flex-col gap-3 p-2 border rounded-lg"
              id="productMenu"
            >
              {order.products.map((product, index) => (
                <li key={index} className="flex gap-2">
                  <div>
                    <img
                      className="rounded-lg"
                      src={`/products/${product.image}`}
                      alt="product"
                      width={80}
                    />
                  </div>
                  <div>
                    <p className="mb-1">
                      <span>Product Name:</span> {product.name}
                    </p>
                    <p className="mb-1">
                      <span>Price:</span> ₹{product.price}
                    </p>
                    <p className="mb-1">
                      <span>Quantity:</span> {product.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {order.status === "Pending" && (
        <button
          onClick={() => handleCancelOrder(order.orderId)}
          className="w-fit self-end btn-transition text-sm bg-primary hover:bg-white border border-primary text-white hover:text-primary px-4 py-2 rounded focus"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default Order;
