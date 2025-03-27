import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const createOrder = async (orderData) => {
  try {
    const response = await httpClient.post(
      API.CREATE_ORDER,
      orderData, // Order data should be passed here as the second parameter
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getAllOrdersByUserId = async (userId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_ALL_ORDERS_BY_USER_ID}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting orders:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await httpClient.get(API.GET_ALL_ORDERS, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};


export const getOrderSummary = async () => {
  try {
    const response = await httpClient.get(API.GET_ORDER_SUMMARY, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getAllOrdersWithOrderPlacedStatus = async () => {
  try {
    const response = await httpClient.get(
      API.GET_ALL_ORDERS_WITH_ORDER_PLACED_STATUS,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await httpClient.get(`${API.GET_ORDER_BY_ID}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await httpClient.put(
      API.CANCEL_ORDER,
      null, // Không có body
      {
        params: { id: orderId },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await httpClient.put(
      API.UPDATE_ORDER_STATUS,
      null, // Không có body

      {
        params: { id: orderId, status },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    console.log(orderId, status);
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
