import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const createManufacture = async ({name }) => {
    try {
        const response = await httpClient.post(API.CREATE_MANUFACTURE, {
          name: name,
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error creating manufacture:", error);
        throw error;
    }
};
export const getAllManufacture = async () => {
    try {
        const response = await httpClient.get(API.GET_ALL_MANUFACTURE);
        return response.data;
      } catch (error) {
        console.error("Error fetching manufacture:", error);
        throw error;
    }
};
export const deleteManufacture = async (id) => {
    try {
      const response = await httpClient.delete(`${API.DELETE_MANUFACTURE}/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting manufacture:", error);
      throw error;
    }
};
export const editManufacture = async (id, {name}) => {
    try {
      const response = await httpClient.put(`${API.EDIT_MANUFACTURE}/${id}`, {
        name: name,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error editing manufacture:", error);
      throw error;
    }
};
export const getAllPaginationSortManufacture = async (
    page = 1,
    size = 10,
    sortBy = "id",
    sortDirection = "desc"
  ) => {
    try {
      const response = await httpClient.get(
        API.GET_ALL_MANUFACTURES_PAGINATION_SORT,
        {
          params: { page, size, sortBy, sortDirection },
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data.result; 
    } catch (error) {
      console.error("Error fetching all manufacture:", error);
      throw error;
    }
};
