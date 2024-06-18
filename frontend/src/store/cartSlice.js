import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import StatusCode from "../util/StatusCode";
import toast from "react-hot-toast";

const apiURL = import.meta.env.VITE_APP_API_URL;

const initialState = {
  cartItems: [],
  status: StatusCode.IDLE,
  error: null,
};

const fetchCartData = async (userId, token) => {
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
      const response = await fetchCartData(userId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, _id, name, price, image, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiURL}/cart/add`,
        {
          userId,
          productId: _id,
          name,
          price,
          image,
          quantity: 1, // Assuming initial quantity is 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Assuming backend returns updated cart
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
      })
      .addCase(addToCart.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
        toast.success("Added to cart!", {
          position: "bottom-right",
          duration: 3000
        })
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
        toast.error("Failed to add to cart!", {
          position: "bottom-right",
          duration: 3000,
        });
      });
  },
});

export default cartSlice.reducer;