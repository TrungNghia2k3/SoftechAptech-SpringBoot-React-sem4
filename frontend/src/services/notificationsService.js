import { API } from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import { getToken } from "./localStorageService";

export const getAllNotificationsByUserId = async (userId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_ALL_NOTIFICATIONS_BY_USER_ID}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting publisher:", error);
    throw error;
  }
};


export const markAllNotificationsAsRead  = async (userId) => {
  try {
    const response = await httpClient.put(
      `${API.MARK_ALL_NOTIFICATIONS_AS_READ}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting publisher:", error);
    throw error;
  }
};