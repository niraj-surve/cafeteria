import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StatusCode from "../util/StatusCode";
import { coffeeData } from "../data/data";

const initialState = {
  data: [],
  product: null,
  status: StatusCode.IDLE,
  error: null,
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCoffeeData = async () => {
  await delay(100);
  return coffeeData;
};

const fetchCoffeeById = async (id) => {
  await delay(100);
  return coffeeData.find((item) => item.id === parseInt(id));
};

export const getProducts = createAsyncThunk("product/loadData", async () => {
  const response = await fetchCoffeeData();
  return response;
});

export const getProductById = createAsyncThunk(
  "product/getProduct",
  async (id, { rejectWithValue }) => {
    try {
      const product = await fetchCoffeeById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null; 
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state) => {
        state.status = StatusCode.ERROR;
        state.error = "Failed to fetch data";
      })
      .addCase(getProductById.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;