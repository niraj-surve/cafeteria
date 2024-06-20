import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice";
import cartSlice from "./cartSlice";
import userSlice from "./userSlice";
import orderSlice from "./orderSlice";
import paymentSlice from "./paymentSlice";

const store = configureStore({
  reducer: {
    product: productSlice,
    cart: cartSlice,
    user: userSlice,
    orders: orderSlice,
    payment: paymentSlice,
  },
});

export default store;