import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const getMyInfo = async () => {
  return await httpClient.get(API.MY_INFO, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await httpClient.post(
      API.CHANGE_PASSWORD,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (
  username,
  password,
  firstName,
  lastName,
  dob,
  phone
) => {
  try {
    const response = await httpClient.post(API.CREATE_USER, {
      username,
      password,
      firstName,
      lastName,
      dob,
      phone,
    });
    return response;
  } catch (error) {
    console.error("User creation failed:", error.message || error);
    throw error;
  }
};

export const verifyAccount = async (username, otp) => {
  try {
    const response = await httpClient.post(API.VERIFY_ACCOUNT, {
      username,
      otp,
    });
    return response;
  } catch (error) {
    console.error("User creation failed:", error.message || error);
    throw error;
  }
};

export const regenerateOtp = async (username) => {
  try {
    const response = await httpClient.post(API.REGENERATE_OTP, {
      username,
    });
    return response;
  } catch (error) {
    console.error("User creation failed:", error.message || error);
    throw error;
  }
};

export const forgotPassword = async (username) => {
  try {
    const response = await httpClient.post(API.FORGOT_PASSWORD, {
      username,
    });
    return response;
  } catch (error) {
    console.error("User creation failed:", error.message || error);
    throw error;
  }
};

export const resetPassword = async (username, newPassword) => {
  try {
    const response = await httpClient.post(
      `${API.RESET_PASSWORD}?username=${username}`,
      {
        newPassword,
      }
    );
    return response;
  } catch (error) {
    console.error("User creation failed:", error.message || error);
    throw error;
  }
};

export const getAllPaginationSorUsers = async (
  page = 1,
  size = 10,
  sortBy = "id",
  sortDirection = "desc"
) => {
  try {
    const response = await httpClient.get(API.GET_ALL_USERS_PAGINATION_SORT, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching all User:", error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await httpClient.get(`${API.GET_USER}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await httpClient.put(
      `${API.UPDATE_USER}/${id}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
