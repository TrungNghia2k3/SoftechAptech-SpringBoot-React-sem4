import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const createPermission = async (name, description) => {
  try {
    const response = await httpClient.post(
      API.CREATE_PERMISSION,
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating permission:", error);
    throw error;
  }
};

export const getAllPermissions = async () => {
  try {
    const response = await httpClient.get(API.GET_ALL_PERMISSION, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
};

export const deletePermission = async (permissionName) => {
  try {
    const response = await httpClient.delete(
      `${API.DELETE_PERMISSON}/${permissionName}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting permission:", error);
    throw error;
  }
};
