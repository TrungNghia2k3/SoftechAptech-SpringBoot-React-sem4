import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const getAddressList = async (userId) => {
  try {
    const response = await httpClient.get(`${API.GET_ADDRESS_LIST}/${userId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting address list:", error);
    throw error;
  }
};

export const createAddress = async (userId, addressData) => {
  try {
    const response = await httpClient.post(
      `${API.CREATE_ADDRESS}/${userId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
};

export const editAddress = async (userId, addressId, addressData) => {
  try {
    const response = await httpClient.put(
      `${API.EDIT_ADDRESS}/${addressId}/${userId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing address:", error);
    throw error;
  }
};
