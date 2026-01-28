import axios from "axios";
import { clearUserData } from "./authUtil";
import store from "../store";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

/**
 * Request Interceptor
 * - Runs before each request is sent.
 * - Its job is to attach the current access token to the Authorization header.
 */
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * - Runs after a response is received.
 * - Handles two main scenarios: successful responses and errors.
 */

let isRefreshing = false;
let refreshTokenPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        try {
          await refreshTokenPromise;
          return apiClient(originalRequest);
        } catch (refreshErr) {
          clearUserData(store.dispatch);
          return Promise.reject(refreshErr);
        }
      }

      isRefreshing = true;

      try {
        refreshTokenPromise = apiClient.post("/auth/refresh").finally(() => {
          isRefreshing = false;
          refreshTokenPromise = null;
        });
        const refreshResponse = await refreshTokenPromise;

        const isValid =
          refreshResponse.data?.valid === true || refreshResponse.data?.valid === "true";
        if (refreshResponse.data && isValid) {
          return apiClient(originalRequest);
        } else {
          clearUserData(store.dispatch);
          return Promise.reject(new Error("Token refresh failed"));
        }
      } catch (refreshErr) {
        clearUserData(store.dispatch);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Performs a GET request.
 * @param {string} endpoint - The API endpoint to call (e.g., "/llms/provider_schema_configs").
 * @returns {Promise<any>} The response data.
 */
export const getRequest = (endpoint, params = {}) => {
  return apiClient.get(endpoint, { params }).then((response) => response.data);
};

/**
 * Performs a POST request.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} body - The request payload.
 * @returns {Promise<any>} The response data.
 */
export const postRequest = (endpoint, body, config = {}) => {
  return apiClient.post(endpoint, body, config).then((response) => response.data);
};

/**
 * Performs a PUT request.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} body - The request payload.
 * @returns {Promise<any>} The response data.
 */
export const putRequest = (endpoint, body, config = {}) => {
  return apiClient.put(endpoint, body, config).then((response) => response.data);
};

/**
 * Performs a DELETE request.
 * @param {string} endpoint - The API endpoint to call.
 * @returns {Promise<any>} The response data.
 */
export const deleteRequest = (endpoint, config = {}) => {
  return apiClient.delete(endpoint, config).then((response) => response.data);
};

/**
 * Performs a PATCH request.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} body - The request payload.
 * @returns {Promise<any>} The response data.
 */
export const patchRequest = (endpoint, body, config = {}) => {
  return apiClient.patch(endpoint, body, config).then((response) => response.data);
};
