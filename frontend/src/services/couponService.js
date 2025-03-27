import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const getAllCoupons = async () => {
  try {
    const response = await httpClient.get(API.GET_ALL_COUPONS);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

export const createCoupon = async ({
  id,
  type,
  value,
  description,
  pointCost,
  minOrderValue,
}) => {
  try {
    const response = await httpClient.post(
      API.CREATE_COUPON,
      {
        id,
        type,
        value,
        description,
        pointCost,
        minOrderValue,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await httpClient.delete(`${API.DELETE_COUPON}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

export const editCoupon = async (
  couponId,
  { id, type, value, description, pointCost, minOrderValue }
) => {
  try {
    const response = await httpClient.put(
      `${API.EDIT_COUPON}/${couponId}`,
      {
        id,
        type,
        value,
        description,
        pointCost,
        minOrderValue,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing coupon:", error);
    throw error;
  }
};

export const getAllPaginationSortCoupons = async (
  page = 1,
  size = 10,
  sortBy = "id",
  sortDirection = "desc"
) => {
  try {
    const response = await httpClient.get(API.GET_ALL_COUPONS_PAGINATION_SORT, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching all coupons:", error);
    throw error;
  }
};

export const redeemCoupon = async (couponId, userId) => {
  try {
    const response = await httpClient.post(API.REDEEM_COUPON, null, {
      params: { couponId, userId },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error redeeming coupon:", error);
    throw error;
  }
};

export const getAllCouponsByUserId = async (userId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_ALL_COUPONS_BY_USER_ID}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all coupons by user ID:", error);
    throw error;
  }
};

export const applyCoupons = async (userId, couponIds) => {
  try {
    const response = await httpClient.post(API.APPLY_COUPONS, couponIds, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error applying coupons:", error);
    throw error;
  }
};
