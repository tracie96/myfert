import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError } from "../Handler/ExceptionHandler";
import { baseUrl } from "../../utils/envAccess";
import { toast } from "react-toastify";

export const fetchSubscriptionPlans = createAsyncThunk(
  "subscription/fetchPlans",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Subscription/GetPlans`,
        config
      );
     
      return response.data; 
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error.response.data);
    }
  }
);
//#endregion

export const checkoutSubscription = createAsyncThunk(
  "subscription/checkoutSubscription",
  async (planId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Subscription/CheckoutSubscription/${planId}`,
        config
      );
      console.log({response})
      return response.data.message; // This should be the URL returned from the API
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error.response.data);
    }
  }
);

export const markSubscriptionSuccess = createAsyncThunk(
  "subscription/markSuccess",
  async (_, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth; 
    const config = {
      headers: {
        Authorization: `Bearer ${user?.obj?.token}`, 
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Subscription/MarkSubscription/true`,
        config
      );
      toast.success("Payment successful, subscription marked!");
      return response.data; 
    } catch (error) {
      handleApiError(error?.response?.data);
      toast.error("Failed to mark subscription");
      return rejectWithValue(error.response?.data);
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    plans: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch plans";
      })
      .addCase(checkoutSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutUrl = action.payload; 
      })
      .addCase(checkoutSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to checkout subscription";
      })
      .addCase(markSubscriptionSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markSubscriptionSuccess.fulfilled, (state) => {
        state.loading = false;
        state.success = true; 
      })
      .addCase(markSubscriptionSuccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to mark subscription";
      });
  },
});

export default subscriptionSlice.reducer;
