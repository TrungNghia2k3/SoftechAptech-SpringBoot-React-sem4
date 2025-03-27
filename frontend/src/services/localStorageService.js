export const KEY_TOKEN = "token";
export const KEY_CURRENT_USER = "user";

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};

export const setUser = (user) => {
  localStorage.setItem(KEY_CURRENT_USER, user);
};

export const getUser = () => {
  return localStorage.getItem(KEY_CURRENT_USER);
};

export const removeUser = () => {
  return localStorage.removeItem(KEY_CURRENT_USER);
};
