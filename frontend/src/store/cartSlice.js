import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import StatusCode from "../util/StatusCode";

const apiURL = import.meta.env.VITE_APP_API_URL;

const initialState = {
  cartItems: [],
  status: StatusCode.IDLE,
  error: null,
};

// Fetch user's cart data from the API with userId and bearer token
const fetchCartData = async ({ userId, token }) => {
  try {
    const response = await axios.get(`${apiURL}/cart?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch cart items");
  }
};

export const getCartItems = createAsyncThunk(
  "cart/loadCart",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await fetchCartData({ userId, token });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;