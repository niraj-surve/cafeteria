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
      throw Error(error.response.data.message || "Login failed");
    }
  }
);

// Async thunk for checking login status
export const checkLoginStatus = createAsyncThunk(
  "user/checkLoginStatus",
  async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return user;
    } else {
      throw new Error("User not logged in");
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "user/toggleFavorite",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.put(
        `${apiURL}/user/favorites/${productId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
          },
        }
      );

      // Assuming response.data.favourites is the updated array of favorites
      const updatedFavourites = response.data.favourites;

      // Update localStorage with the updated favorites
      const user = {
        ...thunkAPI.getState().user.user,
        favourites: updatedFavourites,
      };
      localStorage.setItem("user", JSON.stringify(user));

      return updatedFavourites;
    } catch (error) {
      throw Error(error.response.data.message || "Failed to toggle favorite");
    }
  }
);


// Selector to get user login status
export const selectUser = (state) => state.user.user;
export const selectUserStatus = (state) => state.user.status;

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

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
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.favourites = action.payload;

        const updatedFavourites = action.payload;
        const previousFavourites = state.user.favourites;

        const addedFavorite = updatedFavourites.find(
          (f) => !previousFavourites.includes(f)
        );
        const removedFavorite = previousFavourites.find(
          (f) => !updatedFavourites.includes(f)
        );

        // Determine if a favorite was added or removed and trigger toast accordingly
        if (addedFavorite) {
          toast.success("Added to favorites!", {
            position: "bottom-right",
            duration: 3000,
          });
        } else if (removedFavorite) {
          toast.success("Removed from favorites!", {
            position: "bottom-right",
            duration: 3000,
          });
        }

        // Update localStorage with the latest user object (including favorites)
        const user = {
          ...state.user,
          favourites: updatedFavourites,
        };
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error("Failed to update favorites!", {
          position: "bottom-right",
          duration: 3000,
        });
      });
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;