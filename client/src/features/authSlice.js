import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000";


export const userLogin = createAsyncThunk("auth/userLogin", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, credentials);
    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    return { token, user };
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed. Please try again.';
    toast.error(message); 
    return thunkAPI.rejectWithValue(message);
  }
});


export const adminLogin = createAsyncThunk("auth/adminLogin", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, credentials);
    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    return { token, user };
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed. Please try again.';
    toast.error(message); 
    return thunkAPI.rejectWithValue(message);
  }
});


export const registerUser = createAsyncThunk("auth/registerUser", async (userDetails, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, userDetails);

    const loginResponse = await axios.post(`${API_URL}/user/login`, {
      email: userDetails.email,
      password: userDetails.password,
    });

    return loginResponse.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed. Please try again.';
    toast.error(message); 
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchUserFromToken = createAsyncThunk(
  "auth/fetchUserFromToken",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch user data.");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    authToken: localStorage.getItem("authToken") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.authToken = null;
      localStorage.removeItem("authToken");
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
    // Fetch user from token
      .addCase(fetchUserFromToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFromToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.authToken = action.payload.token;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;
      })
      .addCase(fetchUserFromToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    //userlogin
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.authToken = action.payload.token;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;
        toast.success("Login successful!");
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.authToken = action.payload.token;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;
        toast.success("Admin login successful!");
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // User registration and auto-login
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.authToken = action.payload.token;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;
        toast.success("Registration successful!");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout,updateUser } = authSlice.actions;
export default authSlice.reducer;
