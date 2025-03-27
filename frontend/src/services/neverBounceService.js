import axios from "axios";

export const checkEmailWithNeverBounce = async (email) => {
  try {
    const response = await axios.post("http://localhost:8080/api/email-validation", null, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};
