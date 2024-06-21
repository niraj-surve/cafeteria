import React from "react";
import Navbar from "./components/Navbar/Navbar";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer/Footer";
import { useSelector } from "react-redux";
import StatusCode from "./util/StatusCode";

function App() {
  const userStatus = useSelector((state) => state.user.status);
  const cartStatus = useSelector((state) => state.cart.status);
  const productStatus = useSelector((state) => state.product.status);
  const orderStatus = useSelector((state) => state.orders.status);
  const paymentStatus = useSelector((state) => state.payment.status);

  return (
    <>
      <Navbar />
      <div
        className={`${
          userStatus === StatusCode.LOADING ||
          cartStatus === StatusCode.LOADING ||
          productStatus === StatusCode.LOADING ||
          paymentStatus === StatusCode.LOADING ||
          orderStatus === StatusCode.LOADING
            ? "h-[calc(100vh-64px)]"
            : ""
        }`}
      >
        <AppRoutes />
      </div>
      <Footer />
    </>
  );
}

export default App;
