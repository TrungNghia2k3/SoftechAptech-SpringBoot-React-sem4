import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const vnpayPayment = async (amount, address, phone) => {
  const payload = {
    amount: parseFloat(amount), // Ensure amount is sent as a number
    address: address,
    phone: phone,
  };

  try {
    const response = await httpClient.post(API.PAY, payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error processing transaction:", error);
    // Handle error (e.g., show an error message to the user)
  }
};

export const handlePaymentCallback = async (userId, paramsObject) => {
  try {
    const response = await httpClient.post(
      `${API.CALLBACK_PAY}/${userId}`,
      paramsObject,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error handling callback:", error);
    // Handle error (e.g., show an error message to the user)
  }
};
