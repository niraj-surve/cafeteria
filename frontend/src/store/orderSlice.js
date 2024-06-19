import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import StatusCode from "../util/StatusCode";

const apiURL = import.meta.env.VITE_APP_API_URL;

const initialState = {
  orders: [],
  status: StatusCode.IDLE,
  error: null,
};

// Async thunk to add an order
export const addOrder = createAsyncThunk(
  "order/addOrder",
  async ({ orderData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiURL}/orders/add`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to cancel an order
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async ({ userId, orderId, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiURL}/orders/cancel/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId,
        },
      });
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch user's orders
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiURL}/orders?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addOrder.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order.orderId !== action.payload
        );
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
