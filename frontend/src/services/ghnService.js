import axios from "axios";

const token = "5f63213c-4842-11ef-8e53-0a00184fe694"; // Thay thế bằng token của bạn
const shopId = 193102;
const serviceId = 53320;
const fromDistrictId = 1526;
const fromWardCode = "40103";
const weight = 200; // Replace with the actual weight if different

const apiClient = axios.create({
  baseURL: "https://dev-online-gateway.ghn.vn/shiip/public-api",
  headers: {
    "Content-Type": "application/json",
    Token: token,
  },
});

export const fetchProvinces = () => {
  return apiClient.get("/master-data/province");
};

export const fetchDistricts = (provinceId) => {
  return apiClient.post("/master-data/district", { province_id: provinceId });
};

export const fetchWards = (districtId) => {
  return apiClient.post("/master-data/ward", { district_id: districtId });
};

// Calculate expected delivery time
export const calculateLeadTime = (toDistrictId, toWardCode) => {
  return apiClient.post("/v2/shipping-order/leadtime", {
    from_district_id: fromDistrictId,
    from_ward_code: fromWardCode,
    to_district_id: toDistrictId,
    to_ward_code: toWardCode,
    service_id: serviceId,
  });
};

// Calculate shipping fee
export const calculateFee = (toDistrictId, toWardCode) => {
  return apiClient.post("/v2/shipping-order/fee", {
    from_district_id: fromDistrictId,
    from_ward_code: fromWardCode,
    service_id: serviceId,
    service_type_id: null,
    to_district_id: toDistrictId,
    to_ward_code: toWardCode,
    weight: weight,
  });
};
