import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const getAllCommentAndRatingByProductId = async (productId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_ALL_COMMENT_AND_RATING_BY_PRODUCT_ID}/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments and ratings:", error);
    throw error;
  }
};

export const createCommentAndRating = async (
  userId,
  productId,
  commentRequest
) => {
  try {
    const response = await httpClient.post(
      API.CREATE_COMMENT_AND_RATING,
      commentRequest,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        params: { userId, productId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating comment and rating:", error);
    throw error;
  }
};

export const checkUserPurchasedProduct = async (userId, productId) => {
  try {
    const response = await httpClient.get(API.CHECK_USER_PURCHASED_PRODUCT, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { userId, productId },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user purchase:", error);
    throw error;
  }
};

export const updateCommentAndRating = async (id, commentRequest) => {
  try {
    const response = await httpClient.put(
      `${API.UPDATE_COMMENT_AND_RATING}/${id}`,
      commentRequest,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment and rating:", error);
    throw error;
  }
};

export const deleteCommentAndRating = async (id) => {
  try {
    const response = await httpClient.delete(
      `${API.DELETE_COMMENT_AND_RATING}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting comment and rating:", error);
    throw error;
  }
};

export const getCommentById = async (id) => {
  try {
    const response = await httpClient.get(`${API.GET_COMMENT_BY_ID}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch comment:", error);
    throw error;
  }
};

export const getAllComments = async (
  page = 1,
  size = 10,
  sortBy = "id",
  sortDirection = "desc"
) => {
  try {
    const response = await httpClient.get(API.GET_ALL_COMMENTS, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Assuming the response structure wraps data in 'result'
  } catch (error) {
    console.error("Error fetching all comments:", error);
    throw error;
  }
};

export const addAdminResponse = async (id, adminResponseRequest) => {
  try {
    const response = await httpClient.post(
      `${API.ADD_ADMIN_RESPONSE}/${id}`,
      adminResponseRequest,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error add admin response:", error);
    throw error;
  }
};
