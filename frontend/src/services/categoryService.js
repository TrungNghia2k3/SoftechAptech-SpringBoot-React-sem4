import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const createCategory = async (code, name, image) => {
  try {
    const formData = new FormData();

    // Create the category request object
    const categoryRequest = {
      code,
      name,
    };

    formData.append("request", JSON.stringify(categoryRequest));
    if (image) {
      formData.append("image", image);
    }

    const response = await httpClient.post(API.CREATE_CATEGORY, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (categoryId, code, name, image) => {
  try {
    // Create a FormData object
    const formData = new FormData();

    // Create the category request object
    const categoryRequest = {
      code,
      name,
    };

    // Append the request object as a JSON string
    formData.append("request", JSON.stringify(categoryRequest));

    // Append the image if provided
    if (image) {
      formData.append("image", image);
    }

    // Make the API request
    const response = await httpClient.put(
      `${API.UPDATE_CATEGORY}/${categoryId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await httpClient.get(API.GET_ALL_CATEGORIES);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const searchCategoriesByKeyword = async (keyword) => {
  try {
    const response = await httpClient.get(API.SEARCH_BY_KEYWORD, {
      params: { keyword },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data.result; // Assuming the response structure wraps data in 'result'
  } catch (error) {
    console.error("Error searching categories:", error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await httpClient.get(`${API.GET_CATEGORY_BY_ID}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category by id:", error);
    throw error;
  }
};

export const getAllPaginationSortCategories = async (
  page = 1,
  size = 10,
  sortBy = "id",
  sortDirection = "desc"
) => {
  try {
    const response = await httpClient.get(
      API.GET_ALL_CATAGORIES_PAGINATION_SORT,
      {
        params: { page, size, sortBy, sortDirection },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data.result; // Assuming the response structure wraps data in 'result'
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};

export const toggleDisableCategory = async (id) => {
  try {
    const response = await httpClient.patch(
      `${API.TOGGLE_DISABLE_CATEGORY}/${id}/toggle-disable`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling disable Category:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await httpClient.delete(`${API.DELETE_CATEGORY}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting Category:", error);
    throw error;
  }
};
