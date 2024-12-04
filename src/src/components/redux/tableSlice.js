import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../Handler/ExceptionHandler";
import { toast } from "react-toastify";
import { baseUrl } from "../../utils/envAccess";

//#region Expenses
export const expensesTable = createAsyncThunk(
  "userHistory/expensesTable",
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
        `${baseUrl}Home/GetExpensesDataTable`,
        workRecord,
        config,
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  },
);
//#endregion

export const getLeavesRequestRecords = createAsyncThunk(
  "user/getLeavesRequestRecords",
  async (
    {
      page,
      size,
      sortColumn,
      sortDirection,
      searchParam,
      userId,
      leaveType,
      monthYear,
      leaveStatus,
    },
    { rejectWithValue, getState, dispatch },
  ) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Home/GetLeavesRequestDataTable?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortDirection}&searchValue=${searchParam}&userId=${userId}&leaveType=${leaveType}
        &monthYear=${monthYear}&leaveStatus=${leaveStatus}`,
        null,
        config,
      );
      const responseBack = getResponse(response, dispatch, user);
      if (responseBack?.list.length > 0) {
        return responseBack;
      } else {
        toast.error(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  },
);

const tableSlices = createSlice({
  name: "tables",
  initialState: {
    loading: false,
    appErr: null,
    appStatus: null,
    appStatusCode: null,
    serverErr: null,
  },
  extraReducers: (builder) => {
    builder.addCase(expensesTable.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(expensesTable.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(expensesTable.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(getLeavesRequestRecords.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(getLeavesRequestRecords.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(getLeavesRequestRecords.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
  },
});

export default tableSlices.reducer;
