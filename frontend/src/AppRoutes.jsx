import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Cart from "./components/Cart/Cart";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import { checkLoginStatus } from "./store/userSlice";
import Register from "./pages/Register/Register";
import Checkout from "./pages/Checkout/Checkout";
import Orders from "./components/Orders/Orders";
import Order from "./pages/Order/Order";
import SuccessPayment from "./components/SuccessPayment/SuccessPayment";
import Profile from "./pages/Profile/Profile";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const guestRoutes = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/cart/checkout", element: <Navigate to="/" replace /> },
    { path: "/orders", element: <Navigate to="/" replace /> },
    { path: "/orders/:orderId", element: <Navigate to="/" replace /> },
  ];
  
  const authRoutes = [
    { path: "/login", element: <Navigate to="/" replace /> },
    { path: "/register", element: <Navigate to="/" replace /> },
    { path: "/orders", element: <Orders /> },
    { path: "/orders/:orderId", element: <Order /> },
    { path: "/cart/checkout", element: <Checkout /> },
    { path: "/successPayment", element: <SuccessPayment /> },
    { path: "/profile", element: <Profile /> },
  ];

  const renderRoutes = user ? authRoutes : guestRoutes;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      {renderRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;