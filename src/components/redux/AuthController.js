import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../Handler/ExceptionHandler";
import { toast } from "react-toastify";
import { baseUrl } from "../../utils/envAccess";

//#region Login, Logout
export const postLogin = createAsyncThunk(
  "user/postLogin",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Auth/Login`,
        userData,
        config
      );
      const responseBack = getResponse(response, dispatch);
      if (!responseBack && responseBack === undefined) {
        return responseBack;
      }
      localStorage.setItem("userInfo", JSON.stringify(responseBack));
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch);
    }
  }
);

export const postRegister = createAsyncThunk(
  "user/postRegister",
  async (users, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("role", parseInt(users.role));
    // formData.append("role", 4);
    formData.append("userName", users.userName);
    formData.append("firstName", users.firstName);
    formData.append("lastName", users.lastName);
    formData.append("gender", users.gender);
    formData.append("password", users.password);
    formData.append("confirmPassword", users.cpassword);
    formData.append("email", users.email);
    formData.append("address", users.address);
    formData.append("appartmentOrSuite", users.appartmentOrSuite);
    formData.append("country", users.country);
    formData.append("stateOrProvince", users.stateProvince);
    formData.append("city", users.city);
    formData.append("postalCode", users.postalCode);
    formData.append("phoneNumber", users.phoneNumber);
    formData.append(
      "medicalOrProvincialHealthNumber",
      users.medicalNumberOrProvinceHealthNumber
    );
    formData.append("dob", users.dob);

    formData.append("height", users.height);
    formData.append("weight", users.weight);
    formData.append("isSMS", users.isSMS);
    formData.append(
      "isAgreeToShareInformation",
      users.isAgreeToShareInformation
    );
    formData.append(
      "isAcceptTermsAndConditions",
      users.isAcceptTermsAndCondition
    );
    formData.append("licenseDocument", users.licenseDocument);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Auth/Register`,
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

export const logoutAction = createAsyncThunk(
  "/user/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.auth?.userAuth;
    try {
      localStorage.removeItem("userInfo");
    } catch (error) {
      handleApiError(error, dispatch, user);
    }
  }
);

//get user from local storage and place into store
const userLoginFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
//#endregion

//#region Profile
export const getLoggedInUser = createAsyncThunk(
  "user/profile",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Auth/GetLoggedinUser?id=${id}`,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "user/updateProfileImage",
  async (user, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("Id", user.Id);
    if (user.isDeleted) {
      formData.append("isDelete", 1);
    } else {
      formData.append("file", user.file);
    }
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Auth/UpdateProfilePicture`,
        formData,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (users, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Auth/UpdateProfile`,
        users,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        localStorage.setItem("userInfo", JSON.stringify(responseBack));
        console.log("Profile Update:", responseBack);
        toast.success(response?.data?.message);
      }
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
      rejectWithValue(error);
    }
  }
);
//#endregion

//#region Password
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (user, { rejectWithValue, getState, dispatch }) => {
    //get user token
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Auth/UpdatePassword`,
        user,
        config
      );

      getResponse(response, dispatch, users);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      handleApiError(error, dispatch, users);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/ForgotEmail",
  async (email, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Auth/ForgotPassword`,
        email,
        config
      );
      getResponse(response, dispatch);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      handleApiError(error, dispatch);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/ResetPassword",
  async (data, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("ResetPassword call api: ", data);
    try {
      const response = await axios.post(
        `${baseUrl}Auth/ResetPassword`,
        data,
        config
      );
      getResponse(response, dispatch);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      handleApiError(error, dispatch);
    }
  }
);

//#endregion

//#region Patient subscription
export const postSubscriptionPayment = createAsyncThunk(
  "user/postSubscriptionPayment",
  async (data, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Patient/SubscriptionPayment`,
        data,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        console.log(
          "Subscription controller Update (postSubscriptionPayment) :" +
            responseBack
        );
        toast.success(response?.data?.message);
      }
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
      rejectWithValue(error);
    }
  }
);

export const createCheckoutSession = createAsyncThunk(
  "user/createCheckoutSession",
  async (priceId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Patient/create-checkout-session?priceId=${priceId}`,
        null,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        console.log(
          "create-checkout-session controller Update (postSubscriptionPayment) :" +
            responseBack
        );
        toast.success(response?.data?.message);
      }
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
      // rejectWithValue(error);
    }
  }
);

export const getUpdatedSubscriptionDetail = createAsyncThunk(
  "user/getUpdatedSubscriptionDetail",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetUpdatedSubscriptionDetail?UserId=${userId}`,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        console.log(
          "Get Updated Subscription Detail auth call :",
          responseBack
        );
        // toast.success(response?.data?.message);
      }
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
      rejectWithValue(error);
    }
  }
);

//#endregion

const authSlices = createSlice({
  name: "authentication",
  initialState: {
    userAuth: userLoginFromStorage,
    loading: false,
    appErr: null,
    appStatus: null,
    appStatusCode: null,
    serverErr: null,
  },
  reducers: {
    updateReduxUserAuth: (state, payload) => {
      state.userAuth = payload.payload;
    },
    setReduxUserAuthValuesUndefined: (state) => {
      state.userAuth = {}; // Setting userAuth to an empty object
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postLogin.pending, (state, action) => {
      state.appErr = undefined;
      state.loading = true;
      state.serverErr = undefined;
      state.appStatus = action.payload?.status || null;
      state.appStatusCode = action.payload?.statusCode || null;
    });
    builder.addCase(postLogin.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.appErr = undefined;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action.payload?.status || null;
      state.appStatusCode = action.payload?.statusCode || null;
    });
    builder.addCase(postLogin.rejected, (state, action) => {
      state.appErr = action.payload?.message || null;
      state.serverErr =
        action.error?.message || "An error occurred on the server.";
      state.appStatus = action.payload?.status || null;
      state.appStatusCode = action.payload?.statusCode || null;
      state.loading = false;
    });

    builder.addCase(postRegister.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.appStatus = undefined;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(postRegister.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(postRegister.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.serverErr = undefined;
    });

    //Logout
    builder.addCase(logoutAction.pending, (state, action) => {
      state.loading = false;
    });
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.userAuth = undefined;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.loading = false;
    });

    builder.addCase(updateProfileImage.pending, (state, action) => {
      state.profileLoading = true;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(updateProfileImage.fulfilled, (state, action) => {
      state.userAuth = action?.payload ? action.payload : state.userAuth; //action?.payload;
      state.profileLoading = false;
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(updateProfileImage.rejected, (state, action) => {
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.profileLoading = false;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(updateProfile.pending, (state, action) => {
      state.profileLoading = true;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.userAuth = action?.payload ? action.payload : state.userAuth;
      state.profileLoading = false;
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.profileLoading = false;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(postSubscriptionPayment.pending, (state, action) => {
      state.appErr = undefined;
      state.loading = true;
      state.serverErr = undefined;
      state.appStatus = action.payload?.status;
      state.appStatusCode = action.payload?.statusCode;
    });
    builder.addCase(postSubscriptionPayment.fulfilled, (state, action) => {
      state.userAuth = action?.payload ? action.payload : state.userAuth;
      state.appErr = undefined;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action.payload?.status;
      state.appStatusCode = action.payload?.statusCode;
    });
    builder.addCase(postSubscriptionPayment.rejected, (state, action) => {
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
      state.loading = false;
      state.appStatus = action.payload?.status;
      state.appStatusCode = action.payload?.statusCode;
    });

    builder.addCase(createCheckoutSession.pending, (state, action) => {
      state.userAuth.paymentTimeTicks = null;
      state.profileLoading = true;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(createCheckoutSession.fulfilled, (state, action) => {
      state.userAuth.paymentTimeTicks = action?.payload
        ? action.payload.paymentTimeTicks
        : null;
      state.profileLoading = false;
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(createCheckoutSession.rejected, (state, action) => {
      state.userAuth.paymentTimeTicks = null;
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.profileLoading = false;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(getUpdatedSubscriptionDetail.pending, (state, action) => {
      state.profileLoading = true;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(getUpdatedSubscriptionDetail.fulfilled, (state, action) => {
      state.userAuth.paymentFailure = action?.payload
        ? action?.payload.isSomethingFailure === true
          ? true
          : false
        : false;
      state.profileLoading = false;
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(getUpdatedSubscriptionDetail.rejected, (state, action) => {
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.profileLoading = false;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(updatePassword.pending, (state, action) => {
      state.loading = true;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
      state.appStatusCode = undefined;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
      state.appStatus = false;
      state.appStatusCode = undefined;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(resetPassword.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
  },
});
export const { updateReduxUserAuth, setReduxUserAuthValuesUndefined } =
  authSlices.actions;
export default authSlices.reducer;
