import { API } from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import { getToken } from "./localStorageService";

export const importProduct = async (manufactureProductsRequest) => {
  try {
    const response = await httpClient.post(
      API.IMPORT_PRODUCT,
      manufactureProductsRequest,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error importing product:", error);
    throw error;
  }
};

export const getManufacturesByProductId = async (productId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_MANUFACTURES_BY_PRODUCT_ID}/${productId}/manufactures`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manufactures:", error);
    throw error;
  }
};

export const getManufactureProductById = async (id) => {
  try {
    const response = await httpClient.get(
      `${API.GET_MANUFACTURE_PRODUCT_BY_ID}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manufactures:", error);
    throw error;
  }
};

export const editManufactureProduct = async (
  id,
  manufactureProductsRequest
) => {
  try {
    const response = await httpClient.put(
      `${API.EDIT_MANUFACTURE_PRODUCT}/${id}`,
      manufactureProductsRequest,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manufactures:", error);
    throw error;
  }
};

export const deleteManufactureProduct = async (id) => {
  try {
    const response = await httpClient.delete(
      `${API.DELETE_MANUFACTURE_PRODUCT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manufactures:", error);
    throw error;
  }
};
