import { loginSuccess, logoutSuccess } from "slices/authSlice";
import storage from "./storage";

export const authDataStore = (data, dispatch) => {
  if (!data || !data.user || !data.permissions) {
    console.warn("Invalid auth data received:", data);
    return;
  }

  dispatch(loginSuccess({ user: data.user, permissions: data.permissions }));

  storage.setItem("user", data.user);
  storage.setItem("permissions", data.permissions);
  storage.setItem("isAuthenticated", true);
};

export const checkUserDataFromStorage = (dispatch) => {
  const user = storage.getItem("user");
  const permissions = storage.getItem("permissions");
  const isAuthenticated = storage.getItem("isAuthenticated");

  if (user && permissions) {
    dispatch(loginSuccess({ user, permissions }));
    if (!isAuthenticated) {
      storage.setItem("isAuthenticated", true);
    }
    return true;
  }

  return false;
};

export const clearUserData = (dispatch) => {
  storage.removeItem("user");
  storage.removeItem("permissions");
  storage.removeItem("isAuthenticated");
  dispatch(logoutSuccess());
};
