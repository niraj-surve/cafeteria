import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiURL = import.meta.env.VITE_APP_API_URL;

// Initial state
const initialState = {
  items: [],
  status: "idle", // For loading status
  error: null, // For error handling
};

// Async thunks
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const response = await axios.get(`${apiURL}/cart`);
    return response.data;
  }
);

export const addToCart = createAsyncThunk("cart/addToCart", async (item) => {
  const response = await axios.post(`${apiURL}/cart/add`, item);
  return response.data;
});

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ id, quantity }) => {
    const response = await axios.put(`${apiURL}/cart/update`, { id, quantity });
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id) => {
    const response = await axios.delete(`${apiURL}/cart/remove`, { data: { id } });
    return response.data;
  }
);

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  const response = await axios.delete(`${apiURL}/cart/clear`);
  return response.data;
});

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Update Quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default cartSlice.reducer;