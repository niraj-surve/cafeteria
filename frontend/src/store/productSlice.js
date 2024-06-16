import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StatusCode from "../util/StatusCode"; // Assuming StatusCode is correctly defined elsewhere
import { coffeeData } from "../data/data"; // Assuming coffeeData is correctly imported

const initialState = {
  data: [],
  product: null,
  status: StatusCode.IDLE,
  error: null, // Add error state to handle errors properly
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
        state.error = null; // Reset error state on pending
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null; // Reset error state on success
      })
      .addCase(getProducts.rejected, (state) => {
        state.status = StatusCode.ERROR;
        state.error = "Failed to fetch data"; // Set appropriate error message
      })
      .addCase(getProductById.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null; // Reset error state on pending
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null; // Reset error state on success
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload; // Set error message from rejectWithValue
      });
  },
});

export default productSlice.reducer;