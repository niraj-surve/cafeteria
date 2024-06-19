// cartSlice.js
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

// Fetch Cart Data Function
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

// Existing Async Thunks
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

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, itemId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiURL}/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// New Async Thunks
export const incrementQuantity = createAsyncThunk(
  "cart/incrementQuantity",
  async ({ userId, itemId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiURL}/cart/increase/${itemId}`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const decrementQuantity = createAsyncThunk(
  "cart/decrementQuantity",
  async ({ userId, itemId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiURL}/cart/decrease/${itemId}`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiURL}/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      return initialState;
    },
  },
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
          duration: 3000,
        });
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
        toast.error("Failed to add to cart!", {
          position: "bottom-right",
          duration: 3000,
        });
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
        toast.success("Removed from cart!", {
          position: "bottom-right",
          duration: 3000,
        });
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
        toast.error("Failed to remove from cart!", {
          position: "bottom-right",
          duration: 3000,
        });
      })
      .addCase(incrementQuantity.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(incrementQuantity.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
        toast.error("Failed to increase quantity!", {
          position: "bottom-right",
          duration: 3000,
        });
      })
      .addCase(decrementQuantity.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(decrementQuantity.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
        toast.error("Failed to decrease quantity!", {
          position: "bottom-right",
          duration: 3000,
        });
      })
      .addCase(clearCart.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.status = StatusCode.IDLE;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.payload;
        toast.error("Failed to clear cart!", {
          position: "bottom-right",
          duration: 3000,
        });
      });
  },
});

export const { resetCartState } = cartSlice.actions;

export default cartSlice.reducer;