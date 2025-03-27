// src/features/category/categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    selectedCategoryId: null,
  },
  reducers: {
    setSelectedCategoryId: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
  },
});

export const { setSelectedCategoryId } = categorySlice.actions;

export default categorySlice.reducer;
