import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

// Hàm gọi API thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId, productId, quantity) => {
  try {
    // Gọi API thêm sản phẩm vào giỏ hàng
    const response = await httpClient.post(
      `${API.ADD_TO_CART}/${userId}`,
      { productId, quantity }, // payload gửi đi
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    // Trả về dữ liệu từ response
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const getCartByUserId = async (userId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_CART_BY_USER_ID}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const editCartProductQuantities = async (userId, products) => {
  try {
    const response = await httpClient.put(
      `${API.EDIT_CART_PRODUCT_QUANTITIES}/${userId}`,
      products,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart product quantities:", error);
    throw error;
  }
};

export const removeProductFromCart = async (userId, productId) => {
  try {
    const response = await httpClient.delete(
      `${API.REMOVE_PRODUCT_FROM_CART}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        data: { productId }, // Xóa sản phẩm bằng cách gửi productId trong body của request
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
  }
};
