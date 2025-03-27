import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const createFeedback = async ({ name, email, subject, message }) => {
  try {
    const response = await httpClient.post(API.CREATE_FEEDBACK,   {
      name,
      email,
      subject,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};
export const getAllFeedbacks = async () => {
  try {
    const response = await httpClient.get(API.GET_ALL_FEEDBACKS, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw error;
  }
};
export const deleteFeedback = async (id) => {
  try {
    const response = await httpClient.delete(`${API.DELETE_FEEDBACK}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
};
export const getAllPaginationSortFeedbacks = async (
  page = 1,
  size = 10,
  sortBy = "id",
  sortDirection = "desc"
) => {
  try {
    const response = await httpClient.get(
      API.GET_ALL_FEEDBACKS_PAGINATION_SORT,
      {
        params: { page, size, sortBy, sortDirection },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data.result; // Assuming the response structure wraps data in 'result'
  } catch (error) {
    console.error("Error fetching all feebacks:", error);
    throw error;
  }
};
