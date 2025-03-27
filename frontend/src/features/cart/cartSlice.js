import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToCart,
  getCartByUserId,
  editCartProductQuantities,
  removeProductFromCart,
} from "../../services/cartService";

// Thunk để gọi API thêm sản phẩm vào giỏ hàng
export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const response = await addToCart(userId, productId, quantity);
      return response.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk để lấy thông tin giỏ hàng
export const fetchCartByUserId = createAsyncThunk(
  "cart/fetchCartByUserId",
  async (userId, thunkAPI) => {
    try {
      const response = await getCartByUserId(userId);
      return response.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk để chỉnh sửa số lượng sản phẩm trong giỏ hàng
export const updateCartProductQuantities = createAsyncThunk(
  "cart/updateCartProductQuantities",
  async ({ userId, products }, thunkAPI) => {

    try {
      const response = await editCartProductQuantities(userId, products);
      return response.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk để xóa sản phẩm khỏi giỏ hàng
export const deleteProductFromCart = createAsyncThunk(
  "cart/deleteProductFromCart",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const response = await removeProductFromCart(userId, productId);
      return response.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Khởi tạo state ban đầu
const initialState = {
  items: [],
  totalItemCount: 0,
  totalPrice: 0,
  status: "idle",
  error: null,
};

// Tạo cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProductToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.totalItemCount = action.payload.productQuantity;
        state.totalPrice = action.payload.totalPriceProduct;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetchCartByUserId
      .addCase(fetchCartByUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.totalItemCount = action.payload.productQuantity;
        state.totalPrice = action.payload.totalPriceProduct;
      })
      .addCase(fetchCartByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // updateCartProductQuantities
      .addCase(updateCartProductQuantities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartProductQuantities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.totalItemCount = action.payload.productQuantity;
        state.totalPrice = action.payload.totalPriceProduct;
      })
      .addCase(updateCartProductQuantities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // deleteProductFromCart
      .addCase(deleteProductFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.totalItemCount = action.payload.productQuantity;
        state.totalPrice = action.payload.totalPriceProduct;
      })
      .addCase(deleteProductFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
