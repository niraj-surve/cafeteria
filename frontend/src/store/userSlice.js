import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const apiURL = import.meta.env.VITE_APP_API_URL;

// Async thunk for login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }) => {
    try {
      const response = await axios.post(`${apiURL}/user/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw Error(error.response.data.message || "Login failed"); // Assuming error response contains meaningful message
    }
  }
);

// Async thunk for checking login status
export const checkLoginStatus = createAsyncThunk(
  "user/checkLoginStatus",
  async () => {
    // Simulate checking login status from localStorage or backend API
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return user;
    } else {
      throw new Error("User not logged in");
    }
  }
);

// Initial state - check localStorage for user data
const initialState = {
  user: null,
  status: "idle", // For loading status
  error: null, // For error handling
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logoutUser(state) {
      localStorage.removeItem("user");
      state.user = null;
      toast.success("Logout Successful!", {
        position: "bottom-right",
        duration: 3000,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Login Successful!", {
          position: "bottom-right",
          duration: 3000,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error("Invalid Credentials!", {
          position: "bottom-right",
          duration: 3000,
        });
      })
      // Check login status
      .addCase(checkLoginStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(checkLoginStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { setUser, logoutUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;