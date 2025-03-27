import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import categoryReducer from "../features/category/categorySlice";
import counterReducer from "../features/counter/counterSlice";
import productReducer from "../features/products/productSlice";

const rootReducer = {
  counter: counterReducer,
  auth: authReducer, 
  products: productReducer,
  cart: cartReducer,
  category: categoryReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
