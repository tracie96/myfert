import { createSlice } from "@reduxjs/toolkit";
import { getMiraInfo } from "@/thunks/getMiraInfo";

const initialState = {
  miraInfo: null,
  isLoading: false,
  error: null,
};

const miraInfoSlice = createSlice({
  name: "miraInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMiraInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMiraInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.miraInfo = action.payload;
      })
      .addCase(getMiraInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default miraInfoSlice.reducer;
