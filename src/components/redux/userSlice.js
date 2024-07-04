import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../Handler/ExceptionHandler";
import { toast } from "react-toastify";
import { baseUrl } from "../../utils/envAccess";

//#region designation

export const updateDesignationHistory = createAsyncThunk(
  "users/updateDesignationHistory",
  async (users, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };
    try {
      const response = await axios.put(
        `${baseUrl}Admin/UpdateOfficialDetail`,
        users,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

//#endregion designation

//#region salary

export const updateSalaryHistory = createAsyncThunk(
  "users/updateSalaryHistory",
  async (users, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };
    try {
      const response = await axios.put(
        `${baseUrl}Admin/UpdateSalaryDetail`,
        users,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const updateSalaryAllownces = createAsyncThunk(
  "users/updateSalaryAllownces",
  async (allowances, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };
    try {
      const response = await axios.put(
        `${baseUrl}Admin/PostUpdateSalarySlips`,
        allowances,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (responseBack.status) {
        toast.success(responseBack.message);
      } else {
        toast.warning(responseBack.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

//#endregion salary

//#region workHistory
export const updateWorkHistory = createAsyncThunk(
  "userHistory/updateWorkHistory",
  async (workRecord, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Admin/AddWorkTiming`,
        workRecord,
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

//#region LeavesRequests
export const requestResponse = createAsyncThunk(
  "user/requestResponse",
  async (responseRequest, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Leave/RequestApproval`,
        responseRequest,
        config
      );
      const responseBack = getResponse(response, dispatch, users);
      if (responseBack.status) {
        toast.success(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, users);
    }
  }
);

export const sendRequestForLeave = createAsyncThunk(
  "user/sendRequestForLeave",
  async (sendRequestForLeave, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Leave/AddLeaveRequest`,
        sendRequestForLeave,
        config
      );
      const responseBack = getResponse(response, dispatch, users);
      if (responseBack.status) {
        toast.success(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, users);
    }
  }
);

export const updateRequestForLeave = createAsyncThunk(
  "user/updateRequestForLeave",
  async (updateRequestForLeave, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Leave/UpdateLeaveRequest`,
        updateRequestForLeave,
        config
      );
      const responseBack = getResponse(response, dispatch, users);
      if (responseBack.status) {
        toast.success(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, users);
    }
  }
);
//#endregion

const userHistorySlices = createSlice({
  name: "userHistory",
  initialState: {
    loading: false,
    appErr: null,
    appStatus: null,
    appStatusCode: null,
    serverErr: null,
  },
  extraReducers: (builder) => {
    builder.addCase(updateSalaryHistory.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateSalaryHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateSalaryHistory.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(updateSalaryAllownces.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateSalaryAllownces.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateSalaryAllownces.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(updateDesignationHistory.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateDesignationHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateDesignationHistory.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(requestResponse.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(requestResponse.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(requestResponse.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(sendRequestForLeave.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(sendRequestForLeave.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(sendRequestForLeave.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(updateRequestForLeave.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateRequestForLeave.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateRequestForLeave.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });
  },
});

export default userHistorySlices.reducer;
