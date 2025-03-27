import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const getAllPublishers = async () => {
  try {
    const response = await httpClient.get(API.GET_ALL_PUBLISHERS);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw error;
  }
};

export const createPublisher = async ({ name, code }) => {
  try {
    const response = await httpClient.post(API.CREATE_PUBLISHER, {
      name: name,
      code: code,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating publisher:", error);
    throw error;
  }
};

export const deletePublisher = async (id) => {
  try {
    const response = await httpClient.delete(`${API.DELETE_PUBLISHER}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting publisher:", error);
    throw error;
  }
};

export const editPublisher = async (id, { name, code }) => {
  try {
    const response = await httpClient.put(`${API.EDIT_PUBLISHER}/${id}`, {
      name: name,
      code: code,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing publisher:", error);
    throw error;
  }
};

export const getAllPaginationSortPublishers = async (
  page = 1,
  size = 10,
  sortBy = "id",
  sortDirection = "desc"
) => {
  try {
    const response = await httpClient.get(
      API.GET_ALL_PUBLISHERS_PAGINATION_SORT,
      {
        params: { page, size, sortBy, sortDirection },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data.result; // Assuming the response structure wraps data in 'result'
  } catch (error) {
    console.error("Error fetching all publisher:", error);
    throw error;
  }
};

export const toggleDisablePublisher = async (id) => {
  try {
    const response = await httpClient.patch(`${API.TOGGLE_DISABLE_PUBLISHER}/${id}/toggle-disable`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling disable publisher:", error);
    throw error;
  }
};
