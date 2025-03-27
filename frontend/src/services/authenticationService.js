import {
  getToken,
} from "./localStorageService";

export const isAuthenticated = () => {
  return getToken();
};
