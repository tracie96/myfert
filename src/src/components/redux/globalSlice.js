import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../Handler/ExceptionHandler";
import { toast } from "react-toastify";
import { baseUrl } from "../../utils/envAccess";

//#region Global-API's
export const getById = createAsyncThunk(
  "user/getById",
  async (endPoint, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const response = await axios.get(`${baseUrl}${endPoint}`, config);
      const responseBack = getResponse(response, dispatch, users);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, users);
    }
  },
);

export const deleteRecord = createAsyncThunk(
  "user/deleteRecord",
  async (endpoint, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const url = baseUrl + endpoint;
      const response = await axios.delete(url, config);
      const responseBack = getResponse(response, dispatch, users);
      if (responseBack.status) {
        toast.success(responseBack.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, users);
    }
  },
);

export const getDropdowns = createAsyncThunk(
  "user/getDropdowns",
  async (endpoint, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const url = baseUrl + endpoint;
      const response = await axios.get(url, config);
      const responseBack = getResponse(response, dispatch, users);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, users);
    }
  },
);

//#region Notification
export const getNotifications = createAsyncThunk(
  "user/getNotifications",
  async (endpoint, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const url = `${baseUrl}Notification/GetNotification`;
      const response = await axios.get(url, config);
      const responseBack = getResponse(response, dispatch, users);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, users);
    }
  },
);

export const markNotiAsRead = createAsyncThunk(
  "user/markNotiAsRead",
  async (markRead, { rejectWithValue, getState, dispatch }) => {
    const { notiOrUser, id } = markRead;

    const payload = {
      userId: notiOrUser === "Noti" ? "" : id,
      id: notiOrUser === "Noti" ? id : "",
    };
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const url = `${baseUrl}Notification/MarkAsRead`;
      const response = await axios.put(url, payload, config);
      const responseBack = getResponse(response, dispatch, users);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, users);
    }
  },
);
//#endregion notification
//#endregion

const globalSlice = createSlice({
  name: "globalSlice",
  initialState: {
    loading: false,
    appErr: null,
    appStatus: null,
    appStatusCode: null,
    serverErr: null,
  },
  extraReducers: (builder) => {
    builder.addCase(getById.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getById.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getById.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(deleteRecord.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(deleteRecord.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(deleteRecord.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(getDropdowns.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getDropdowns.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getDropdowns.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(getNotifications.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getNotifications.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(markNotiAsRead.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(markNotiAsRead.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(markNotiAsRead.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });
  },
});

export default globalSlice.reducer;
