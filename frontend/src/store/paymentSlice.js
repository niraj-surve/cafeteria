import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import StatusCode from "../util/StatusCode";

const apiURL = import.meta.env.VITE_APP_API_URL;

const initialState = {
  paymentURL: null,
  status: StatusCode.IDLE,
  error: null,
};

// Async thunk to create a payment session with Bearer token
export const createPaymentSession = createAsyncThunk(
  "payment/createPaymentSession",
  async ({ paymentData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiURL}/payment/session/create`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentSession.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(createPaymentSession.fulfilled, (state, action) => {
        state.status = StatusCode.SUCCEEDED;
        state.paymentURL = action.payload;
        state.error = null;
      })
      .addCase(createPaymentSession.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || action.error.message;
      });
  },
});

export default paymentSlice.reducer;