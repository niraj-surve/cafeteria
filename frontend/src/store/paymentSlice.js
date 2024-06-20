import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import StatusCode from "../util/StatusCode";

const apiURL = import.meta.env.VITE_APP_API_URL;

const initialState = {
  session: null,
  status: StatusCode.IDLE,
  error: null,
};

// Fetch session key from the API
const fetchSessionKey = async (paymentData, token) => {
  const response = await axios.post(
    `${apiURL}/payment/get-sessionKey`,
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Verify session key with the API
const verifySession = async (sessionData, token) => {
  const response = await axios.post(
    `${apiURL}/payment/session/verify`,
    sessionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getSessionKey = createAsyncThunk(
  "payment/getSessionKey",
  async ({ paymentData, token }, { rejectWithValue }) => {
    try {
      const response = await fetchSessionKey(paymentData, token);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const verifySessionKey = createAsyncThunk(
  "payment/verifySessionKey",
  async ({ sessionData, token }, { rejectWithValue }) => {
    try {
      const response = await verifySession(sessionData, token);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSessionKey.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(getSessionKey.fulfilled, (state, action) => {
        state.session = action.payload.data;
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(getSessionKey.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      })
      .addCase(verifySessionKey.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(verifySessionKey.fulfilled, (state, action) => {
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(verifySessionKey.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;