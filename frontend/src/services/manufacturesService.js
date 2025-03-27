import { API } from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import { getToken } from "./localStorageService";

export const getAllManufactures = async () => {
  try {
    const response = await httpClient.get(API.GET_ALL_MANUFACTURES, {
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
