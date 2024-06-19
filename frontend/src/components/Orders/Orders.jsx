import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder, fetchOrders } from "../../store/orderSlice.js";
import { selectUser } from "../../store/userSlice";
import StatusCode from "../../util/StatusCode.js";
import toast from "react-hot-toast";

const Orders = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const orders = useSelector((state) => state.orders.orders);
  const status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;
  const token = storedUser ? storedUser.token : null;

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders({ userId, token }));
    }
  }, [dispatch, user, userId, token]);

  const handleCancelOrder = (orderId) => {
    dispatch(cancelOrder({ userId, orderId, token })).then((result) => {
      if (result.payload === orderId) {
        toast.success("Order cancelled successfully!", {
          position: "bottom-right",
          duration: 3000
        });
      }
    });
  };

  if (status === StatusCode.LOADING) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (status === StatusCode.ERROR) {
    return <div className="text-center mt-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-lg">No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.orderId} className="border-b py-4">
              <div className="flex justify-between items-center mb-4 font-mulish">
                <div className="flex gap-8 text-sm">
                  <div>
                    {order.products.length > 0 && (
                      <img
                        src={`/products/${order.products[0].image}`}
                        alt="Product Image"
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="font-bold">Order ID:</span>{" "}
                      {order.orderId}
                    </div>
                    <div>
                      <span className="font-bold">Order Date:</span>{" "}
                      {new Date(order.orderDate).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-bold">Status:</span> {order.status}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="font-bold">Total Items:</span>{" "}
                      {order.products.length}
                    </div>
                    <div>
                      <span className="font-bold">Receiver's Name:</span>{" "}
                      {order.name}
                    </div>
                    <div>
                      <span className="font-bold">Payment:</span>{" "}
                      {order.paymentOption === "cash"
                        ? "Cash"
                        : "Online Payment"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCancelOrder(order.orderId)}
                  className="btn-transition text-sm bg-primary hover:bg-white border border-primary text-white hover:text-primary px-4 py-2 rounded focus"
                >
                  Cancel Order
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
