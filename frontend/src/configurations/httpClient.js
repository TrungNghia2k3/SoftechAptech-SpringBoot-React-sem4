import axios from "axios";
import { CONFIG, API } from "./configuration";
import {
  getToken,
  removeToken,
  removeUser,
  setToken,
} from "../services/localStorageService";

const httpClient = axios.create({
  baseURL: CONFIG.API_GATEWAY,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
httpClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
httpClient.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  // Do something with response error
  async function (error) {
    if (error.response && error.response.status === 401) {
      try {
        const token = getToken();
        const refreshResponse = await axios.post(
          CONFIG.API_GATEWAY + API.REFRESH_TOKEN,
          { token }
        );
        // Check if refreshResponse contains a valid token
        if (refreshResponse.data.result.token) {
          const newToken = refreshResponse.data.result.token;
          console.log(newToken);
          setToken(newToken);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axios(error.config);
        }
      } catch (refreshError) {
        removeToken();
        removeUser();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
