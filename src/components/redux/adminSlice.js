import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../Handler/ExceptionHandler";
import { toast } from "react-toastify";
import { baseUrl } from "../../utils/envAccess";

//#region Dashboard
export const activeUserCount = createAsyncThunk(
  "admin/activeUserCount",
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
        `${baseUrl}Admin/GetActiveUserCount`,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);
//#endregion Dashboard

//#region Preview Link

export const addPreviewLinkRecord = createAsyncThunk(
  "admin/addPreviewLinkRecord",
  async (obj, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("title", obj.title);
    formData.append("description", obj.description);
    formData.append("link", obj.link);
    if (obj.primaryImage) {
      formData.append("primaryImage", obj.primaryImage);
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Admin/AddPreviewLink`,
        formData,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (responseBack?.status) {
        toast.success(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const updatePreviewLinkRecord = createAsyncThunk(
  "admin/updatePreviewLinkRecord",
  async (obj, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("id", obj.id);
    formData.append("title", obj.title);
    formData.append("description", obj.description);
    formData.append("link", obj.link);
    if (obj.primaryImage) {
      formData.append("primaryImage", obj.primaryImage);
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Admin/UpdatePreviewLink`,
        formData,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (responseBack?.status) {
        toast.success(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const previewLinkList = createAsyncThunk(
  "admin/previewLinkList",
  async (
    { page, size, sortColumn, sortDirection, searchParam },
    { rejectWithValue, getState, dispatch }
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
        `${baseUrl}Admin/GetPreviewLink?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortDirection}&searchValue=${searchParam}`,
        null,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);
//#endregion Dashboard

//#region Company

export const addCompany = createAsyncThunk(
  "user/postCompany",
  async (company, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("companyName", company.companyName);
    formData.append("profilePicture", company.profilePicture);
    formData.append("companyAddress", company.companyAddress);
    formData.append("companyContact", company.companyContact);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Admin/AddCompany`,
        formData,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (responseBack?.status) {
        toast.success(responseBack?.message);
      } else {
        toast.error(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const companyListDropdown = createAsyncThunk(
  "user/companyListDropdown",
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
        `${baseUrl}Admin/GetCompanyList`,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const companyList = createAsyncThunk(
  "user/companyList",
  async (
    { page, size, sortColumn, sortOrder, searchParam },
    { rejectWithValue, getState, dispatch }
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
        `${baseUrl}Admin/GetCompany?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortOrder}&searchValue=${searchParam}`,
        null,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const updateRecord = createAsyncThunk(
  "user/updateRecord",
  async (company, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("Id", company.id);
    formData.append("companyName", company.companyName);
    formData.append("profilePicture", company.profilePicture);
    formData.append("companyAddress", company.companyAddress);
    formData.append("companyContact", company.companyContact);
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Admin/UpdateCompany`,
        formData,
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

//#region Department

export const addDepartment = createAsyncThunk(
  "user/addDepartment",
  async (department, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Admin/AddDepartment`,
        department,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
      console.log(responseBack)
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const departmentList = createAsyncThunk(
  "user/departmentList",
  async (
    { page, size, sortColumn, sortDirection, searchParam },
    { rejectWithValue, getState, dispatch }
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
        `${baseUrl}Admin/GetDepartment?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortDirection}&searchValue=${searchParam}`,
        null,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "user/updateDepartment",
  async (department, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Admin/UpdateDepartment`,
        department,
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

export const departmentListDropdown = createAsyncThunk(
  "user/departmentListDropdown",
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
        `${baseUrl}Admin/GetDepartmentList`,
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

//#region User
export const addUser = createAsyncThunk(
  "user/addUser",
  async (users, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("firstName", users.firstName);
    formData.append("lastName", users.lastName);
    formData.append("userName", users.userName);
    formData.append("email", users.email);
    formData.append("primaryContact", users.phoneNumber);
    formData.append("password", users.password);
    formData.append("address", users.address);
    formData.append("gender", users.gender);
    formData.append("role", parseInt(users.role));
    formData.append("dob", users.dob);
    formData.append("employeeId", users.employeeId);
    formData.append("companyId", users.companyId);
    formData.append("departmentId", users.departmentId);
    formData.append("profilePicture", users.profilePicture);
    formData.append("cnicFrontScan", users.cnicFrontScan);
    formData.append("cnicBackScan", users.cnicBackScan);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Admin/AddEmployee`,
        formData,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (responseBack?.status) {
        toast.success(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const updateUserPersonalDetail = createAsyncThunk(
  "user/updateUserPersonalDetail",
  async (users, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("id", users.id);
    formData.append("companyId", users.companyId);
    formData.append("firstName", users.firstName);
    formData.append("lastName", users.lastName);
    formData.append("primaryContact", users.phoneNumber);
    formData.append("address", users.address);
    formData.append("gender", users.gender);
    formData.append("dob", users.dob);
    formData.append("profilePicture", users.profilePicture);
    formData.append("cnicFrontScan", users.cnicFrontScan);
    formData.append("cnicBackScan", users.cnicBackScan);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.put(
        `${baseUrl}Admin/UpdatePersonalDetail`,
        formData,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (responseBack?.status) {
        toast.success(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const usersList = createAsyncThunk(
  "user/usersList",
  async (
    { page, size, sortColumn, sortDirection, searchParam },
    { rejectWithValue, getState, dispatch }
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
        `${baseUrl}Admin/GetUserTable?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortDirection}&searchValue=${searchParam}`,
        null,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const userListDropdown = createAsyncThunk(
  "user/userListDropdown",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.get(`${baseUrl}Admin/GetUserList`, config);
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);
//#endregion

//#region GetLists
export const salaryHistory = createAsyncThunk(
  "user/salaryHistory",
  async (
    {
      page,
      size,
      sortColumn,
      sortDirection,
      searchParam,
      userId,
      startDate,
      endDate,
    },
    { rejectWithValue, getState, dispatch }
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
        `${baseUrl}Home/GetSalarySlipsDataTable?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortDirection}&searchValue=${searchParam}&userId=${userId}&startDate=${startDate}
        &endDate=${endDate}`,
        null,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const designationHistory = createAsyncThunk(
  "user/designationHistory",
  async (
    {
      page,
      size,
      sortColumn,
      sortDirection,
      searchParam,
      userId,
      startDate,
      endDate,
    },
    { rejectWithValue, getState, dispatch }
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
        `${baseUrl}Home/GetDesignationHistoryTable?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortDirection}&searchValue=${searchParam}&userId=${userId}&startDate=${startDate}
        &endDate=${endDate}`,
        null,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const designationHistoryList = createAsyncThunk(
  "user/designationHistoryList",
  async (
    { page, size, sortColumn, sortDirection, searchParam, startDate, endDate },
    { rejectWithValue, getState, dispatch }
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
        `${baseUrl}Home/GetDesignationHistoryListTable?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortDirection}&searchValue=${searchParam}&startDate=${startDate}
        &endDate=${endDate}`,
        null,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const workTimeHistory = createAsyncThunk(
  "user/workTimeHistory",
  async (
    {
      page,
      size,
      sortColumn,
      sortDirection,
      searchParam,
      userId,
      startDate,
      endDate,
    },
    { rejectWithValue, getState, dispatch }
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
        `${baseUrl}Home/GetWorkTimingTable?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortDirection}&searchValue=${searchParam}&userId=${userId}&startDate=${startDate}
        &endDate=${endDate}`,
        null,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const addPersonalDocument = createAsyncThunk(
  "user/addPersonalDocument",
  async (data, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("documentType", data.documentType);
    formData.append("userId", data.userId);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Admin/AddPersonalDocument`,
        formData,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (responseBack?.status) {
        toast.success(responseBack?.message);
      }
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  }
);

export const personalDocumentDataTable = createAsyncThunk(
  "user/personalDocumentDataTable",
  async (
    { page, size, sortColumn, sortDirection, searchParam, userId },
    { rejectWithValue, getState, dispatch }
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
        `${baseUrl}Admin/PersonalDocumentDataTable?start=${page}&length=${size}&sortColumnName=${sortColumn}
        &sortDirection=${sortDirection}&searchValue=${searchParam}&userId=${userId}`,
        null,
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

const adminSlices = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    appErr: null,
    appStatus: null,
    appStatusCode: null,
    serverErr: null,
  },
  extraReducers: (builder) => {
    builder.addCase(addCompany.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addCompany.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(companyList.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(companyList.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(companyList.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(companyListDropdown.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(companyListDropdown.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(companyListDropdown.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(userListDropdown.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(userListDropdown.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(userListDropdown.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(activeUserCount.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(activeUserCount.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(activeUserCount.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(previewLinkList.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(previewLinkList.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(previewLinkList.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(addPreviewLinkRecord.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addPreviewLinkRecord.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addPreviewLinkRecord.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(updatePreviewLinkRecord.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updatePreviewLinkRecord.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updatePreviewLinkRecord.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(departmentListDropdown.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(departmentListDropdown.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(departmentListDropdown.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(updateRecord.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateRecord.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateRecord.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(updateUserPersonalDetail.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateUserPersonalDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateUserPersonalDetail.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(addUser.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(addDepartment.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addDepartment.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addDepartment.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(departmentList.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(departmentList.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(departmentList.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(updateDepartment.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateDepartment.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateDepartment.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(usersList.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(usersList.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(usersList.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    //#region Lists

    builder.addCase(salaryHistory.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(salaryHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(salaryHistory.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(designationHistory.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(designationHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(designationHistory.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(designationHistoryList.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(designationHistoryList.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(designationHistoryList.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    //#endregion

    //#region Documents
    builder.addCase(addPersonalDocument.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addPersonalDocument.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(addPersonalDocument.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    builder.addCase(personalDocumentDataTable.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(personalDocumentDataTable.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(personalDocumentDataTable.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    //#endregion
  },
});

export default adminSlices.reducer;
