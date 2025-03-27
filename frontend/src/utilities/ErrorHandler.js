import { toast } from "react-toastify";

export const handleError = (error, action) => {
  const errorMessage =
    error.response?.data?.message || error.message || "Something went wrong";
  toast.error(`${action} failed: ${errorMessage}`);
};
