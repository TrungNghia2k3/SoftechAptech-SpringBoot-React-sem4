import { API } from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import { getToken } from "./localStorageService";

export const getWishlistByUserId = async (userId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_WISHLIST_BY_USER_ID}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

export const addProductToWishlist = async (userId, productId) => {
  try {
    const response = await httpClient.post(
      API.ADD_PRODUCT_TO_WISHLIST,
      null, // Không cần gửi body cho POST request này
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        params: {
          userId, // Thêm userId vào query params
          productId, // Thêm productId vào query params
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    throw error;
  }
};

export const removeProductFromWishlist = async (userId, productId) => {
  try {
    const response = await httpClient.delete(API.REMOVE_PRODUCT_FROM_WISHLIST, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { userId, productId },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    throw error;
  }
};

export const checkIfInWishlist = async (userId, productId) => {
  try {
    const response = await httpClient.get(API.CHECK_IF_IN_WISH_LIST, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { userId, productId },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking if product is in wishlist:", error);
    throw error;
  }
};
