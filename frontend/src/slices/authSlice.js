import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "utils/apiClient";
import { authDataStore } from "utils/authUtil";
import storage from "utils/storage";

export const getPermissionAgain = createAsyncThunk(
  "auth/getPermissionAgain",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const userData = await getRequest("/auth/permission");
      authDataStore(userData, dispatch);
      return userData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const defaultEmptyPermissions = {
  menu_items: [],
  apis: [],
  buttons: [],
};

const initialState = {
  isAuthenticated: !!storage.getItem("isAuthenticated"),
  user: null,
  permissions: defaultEmptyPermissions,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { user, permissions } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.permissions = permissions;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.permissions = defaultEmptyPermissions;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
