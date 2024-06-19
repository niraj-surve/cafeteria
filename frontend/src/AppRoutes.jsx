import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Cart from "./components/Cart/Cart";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import { checkLoginStatus } from "./store/userSlice";
import Register from "./pages/Register/Register";
import Checkout from "./pages/Checkout/Checkout";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      {!user ? (
        <Route path="/login" element={<Login />} />
      ) : (
        <Route path="/login" element={<Navigate to="/" replace />} />
      )}
      {!user ? (
        <Route path="/register" element={<Register />} />
      ) : (
        <Route path="/register" element={<Navigate to="/" replace />} />
      )}
      {user ? (
        <Route path="/cart/checkout" element={<Checkout />} />
      ) : (
        <Route path="/cart/checkout" element={<Navigate to="/" replace />} />
      )}
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
