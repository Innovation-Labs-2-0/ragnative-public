import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
};

const licenseSlice = createSlice({
  name: "license",
  initialState,
  reducers: {
    setLicenseError(state, action) {
      state.error = action.payload;
    },
    clearLicenseError(state) {
      state.error = null;
    },
  },
});

export const { setLicenseError, clearLicenseError } = licenseSlice.actions;
export default licenseSlice.reducer;
