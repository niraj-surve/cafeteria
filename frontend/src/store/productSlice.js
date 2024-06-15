import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StatusCode from "../util/StatusCode";
import { coffeeData } from "../data/data";

const initialState = {
  data: [],
  status: "idle",
};

export const getProducts = createAsyncThunk(
  "product/loadData",
  async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(coffeeData);
      }, 100);
    });
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export default productSlice.reducer;