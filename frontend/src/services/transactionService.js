import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const cashOnDeliveryTransaction = async (
  userId,
  amount,
  address,
  phone
) => {
  const payload = {
    amount: parseFloat(amount), // Ensure amount is sent as a number
    address: address,
    phone: phone,
  };

  try {
    const response = await httpClient.post(
      `${API.CASH_ON_DELIVERY}/${userId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing Cash on Delivery transaction:", error);
    // Handle error (e.g., show an error message to the user)
  }
};
