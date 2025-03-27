// Importing necessary modules from Redux Toolkit and axios for API calls.
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import httpClient from "../../configurations/httpClient";
import { API } from "../../configurations/configuration";

// Asynchronous thunk action for logging in
// Takes in username and password, and returns a token if successful
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      // Making a POST request to the login endpoint with the provided credentials
      const response = await axios.post(
        "http://localhost:8080/api/auth/token",
        { username, password }
      );

      const token = response.data.result.token;
      // Extracting the token from the response
      localStorage.setItem("token", token); // Storing the token in localStorage for persistence
      return token; // Returning the token as the fulfilled value of the action
    } catch (error) {
      // Handling errors and returning the error response
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Asynchronous thunk action for fetching user information
// Uses the stored token to make an authenticated request
export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token"); // Retrieving the token from localStorage
    try {
      // Making a GET request to the user info endpoint with the token in the header
      const response = await axios.get(
        "http://localhost:8080/api/users/my-info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result; // Returning the user information as the fulfilled value of the action
    } catch (error) {
      // Handling errors and returning the error response
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem("token");
      const response = await httpClient.post(API.LOGOUT, {
        token: accessToken,
      });

      if (response.data && response.data.code === 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return; // Trả về giá trị rỗng khi logout thành công
      } else {
        return thunkAPI.rejectWithValue("Logout failed");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("An error occurred during logout");
    }
  }
);

// Creating a slice for authentication-related state
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null, // Trạng thái ban đầu của token
    user: JSON.parse(localStorage.getItem("user")) || null, // Trạng thái ban đầu của thông tin người dùng
    loading: false, // Trạng thái ban đầu của loading
    error: null, // Trạng thái ban đầu của error
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true; // Đặt loading thành true khi đang xử lý đăng nhập
        state.error = null; // Xóa thông báo lỗi trước đó
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload; // Lưu token vào Redux state khi đăng nhập thành công
        state.loading = false; // Đặt loading thành false
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false; // Đặt loading thành false khi đăng nhập thất bại
        state.error = action.payload; // Lưu thông báo lỗi
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true; // Đặt loading thành true khi đang tải thông tin người dùng
        state.error = null; // Xóa thông báo lỗi trước đó
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload; // Lưu thông tin người dùng vào Redux state
        localStorage.setItem("user", JSON.stringify(action.payload)); // Lưu thông tin người dùng vào localStorage
        state.loading = false; // Đặt loading thành false
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false; // Đặt loading thành false khi tải thông tin người dùng thất bại
        state.error = action.payload; // Lưu thông báo lỗi
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
