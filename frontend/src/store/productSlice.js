import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import StatusCode from "../util/StatusCode";

const apiURL = import.meta.env.VITE_APP_API_URL;

const initialState = {
  data: [],
  tags: [],
  product: null,
  status: StatusCode.IDLE,
  error: null,
};

// Fetch product data from the API
const fetchProductData = async () => {
  const response = await axios.get(`${apiURL}/products`);
  return response.data;
};

// Fetch product tags from the API
const fetchTags = async () => {
  const response = await axios.get(`${apiURL}/products/tags`);
  return response.data;
};

// Fetch product data by ID from the API
const fetchProductById = async (id) => {
  const response = await axios.get(`${apiURL}/products/product/${id}`);
  return response.data;
};

// Toggle favourite status on the API
const toggleFavouriteOnApi = async (id, favourite) => {
  const response = await axios.post(`${apiURL}/products/product/favourite`, {
    id,
    favourite,
  });
  return response.data;
};

export const getProducts = createAsyncThunk("product/loadData", async () => {
  const response = await fetchProductData();
  return response;
});

export const getProductsTags = createAsyncThunk(
  "product/loadTags",
  async () => {
    const response = await fetchTags();
    return response;
  }
);

export const getProductById = createAsyncThunk(
  "product/getProduct",
  async (id, { rejectWithValue }) => {
    try {
      const product = await fetchProductById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavourite = createAsyncThunk(
  "product/toggleFavourite",
  async ({ id, favourite }, { rejectWithValue }) => {
    try {
      const updatedProduct = await toggleFavouriteOnApi(id, favourite);
      return updatedProduct;
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
      .addCase(getProducts.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.error.message;
      })
      .addCase(getProductsTags.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(getProductsTags.fulfilled, (state, action) => {
        state.tags = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(getProductsTags.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.error.message;
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
      })
      .addCase(toggleFavourite.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        // Update the product in the state with the updated one
        if (state.product && state.product._id === action.payload._id) {
          state.product = action.payload;
        }
        // Update data array if necessary
        const index = state.data.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(toggleFavourite.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;