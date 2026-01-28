import { postRequest } from "./apiClient";
import { clearUserData } from "./authUtil";
export const handleLogout = async (reduxDispatch, navigate, onSuccess, onError) => {
  try {
    await postRequest("/auth/logout", {});
    clearUserData(reduxDispatch);

    if (onSuccess) {
      onSuccess();
    }

    navigate("/authentication/sign-in");
  } catch (error) {
    console.error("Logout failed:", error);

    if (onError) {
      onError(error);
    }
  }
};
