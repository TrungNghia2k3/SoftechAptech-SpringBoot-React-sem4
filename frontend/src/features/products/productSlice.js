import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFilteredProductsFromAPI } from "../../services/productService"; // Import API service

// Async thunk for fetching filtered products
export const fetchFilteredProducts = createAsyncThunk(
  "products/fetchFilteredProducts",
  async (filters, thunkAPI) => {
    try {
      // Prepare query parameters for API call
      const params = {};
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.publisherId) params.publisherId = filters.publisherId;
      if (filters.formality.length > 0)
        params.formality = filters.formality.join(","); // Convert array to comma-separated string
      if (filters.title) params.title = filters.title;
      if (filters.minPrice || filters.maxPrice < 10000000) {
        params.minPrice = filters.minPrice;
        params.maxPrice = filters.maxPrice;
      }
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.asc !== undefined) params.asc = filters.asc;
      params.page = filters.page;
      params.size = filters.size;

      console.log("Params: ", params); // Debug: Log query parameters

      // Fetch data from API
      const response = await fetchFilteredProductsFromAPI(params);
      // console.log(response.result); // Debug: Log API response
      return response.result; // Return full API response (including pagination info)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); // Handle API errors
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    filteredProducts: {
      content: [], // List of products
      pageNumber: 0, // Current page number
      totalPages: 0, // Total number of pages
    },
    filters: {
      categoryId: null,
      publisherId: null,
      formality: [],
      minPrice: 0,
      maxPrice: 10000000,
      title: "",
      sortBy: "price",
      asc: true,
      page: 0,
      size: 12,
    },
    status: "idle", // Loading status
    error: null, // Error state
  },
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload; // Update filters in the Redux store
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.status = "loading"; // Set status to loading while fetching
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.status = "succeeded"; // Set status to succeeded on successful fetch
        state.filteredProducts = action.payload; // Update filtered products
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.status = "failed"; // Set status to failed on fetch error
        state.error = action.payload; // Store error message
      });
  },
});

export const { setFilters } = productSlice.actions; // Export setFilters action

export const selectFilteredProducts = (state) =>
  state.products.filteredProducts; // Selector for filtered products

export default productSlice.reducer; // Export reducer for use in store
