import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../Handler/ExceptionHandler";
import { baseUrl } from "../../utils/envAccess";

//#region preview link
export const getPreviewLinkList = createAsyncThunk(
  "patient/getPreviewLinkList",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetPreviewLinkList`,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);
//#endregion

const patientSlices = createSlice({
  name: "patient",
  initialState: {
    patientLoading: false,
    patientAppErr: null,
    patientAppStatus: null,
    patientAppStatusCode: null,
    patientServerErr: null,
  },
  extraReducers: (builder) => {
    builder.addCase(getPreviewLinkList.pending, (state, action) => {
      state.patientLoading = true;
      state.patientAppErr = undefined;
      state.patientAppStatus = undefined;
      state.patientAppStatusCode = undefined;
      state.patientServerErr = undefined;
    });
    builder.addCase(getPreviewLinkList.fulfilled, (state, action) => {
      state.patientLoading = false;
      state.patientAppStatus = action?.payload?.status;
      state.patientAppErr = action?.payload?.message;
      state.patientAppStatusCode = action?.payload?.statusCode;
      state.patientServerErr = action?.error?.message;
    });
    builder.addCase(getPreviewLinkList.rejected, (state, action) => {
      state.patientLoading = false;
      state.patientAppErr = action?.payload?.message;
      state.patientServerErr = action?.error?.message;
      state.patientAppStatus = action?.payload?.status;
      state.patientAppStatusCode = action?.payload?.statusCode;
    });
  },
});

export default patientSlices.reducer;
