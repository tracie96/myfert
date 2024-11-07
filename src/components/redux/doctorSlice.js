import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getResponse, handleApiError } from "../Handler/ExceptionHandler";
import { baseUrl } from "../../utils/envAccess";

export const patientList = createAsyncThunk(
  "doctor/patientList",
  async ({ page, size }, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Doctor/GetPatient/${page}/${size}`,
        config,
      );
      return response;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  },
);

export const submitAvailability = createAsyncThunk(
  "availability/submitAvailability",
  async (availabilityData, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    console.log(user);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}doctor/setAvailability`,
        availabilityData,
        config,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const getAvailability = createAsyncThunk(
  "availability/getAvailability",
  async ({ month, year }, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Doctor/GetAvailability/${month}/${year}`,
        config,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
export const getPatientAvailability = createAsyncThunk(
  "availability/getAvailability",
  async ({ month, year }, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetAvailability/${month}/${year}`,
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const getZohoClientID = createAsyncThunk(
  "doctor/getZohoClientID",
  async (_, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Doctor/GetZohoClientId`,
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const getAvailableDoctorsForDate = createAsyncThunk(
  "availability/getAvailableDoctorsForDate",
  async (date, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetAvailableDoctorForDate/${date}`,
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
export const getDoctorAvailabilityForDay = createAsyncThunk(
  "availability/getDoctorAvailabilityForDay",
  async ({ doctorId, date }, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetDoctorAvailabilityForDay/${doctorId}/${date}`,
        config,
      );
      return { doctorId, data: response.data }; // Include doctorId in the payload
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
export const setPatientAppointment = createAsyncThunk(
  "availability/setPatientAppointment",
  async (appointmentId, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth; // Assuming user authentication is stored here
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Patient/SetPatientAppointment/${appointmentId}`,
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const codeGrantAuth = createAsyncThunk(
  "user/codeGrantAuth",
  async ( {appointmentId,code}, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.obj?.token}`,
      },
    };

    try {
      const url = `${baseUrl}Patient/SetPatientAppointment/${appointmentId}/${code}`;
      const response = await axios.get(url, config);
      const responseBack = getResponse(response, dispatch, users);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, users);
    }
  },
);

export const cancelPatientAppointment = createAsyncThunk(
  "availability/cancelPatientAppointment",
  async (appointmentId, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth; // Assuming user authentication is stored here
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Patient/UnSetPatientAppointment/${appointmentId}`,
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const getUpcomingAppointments = createAsyncThunk(
  "doctor/getUpcomingAppointments",
  async (_, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth; 
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`, 
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Doctor/GetUpComingAppointment`,
        config
      );
      return response.data; 
    } catch (error) {
      return rejectWithValue(error?.response?.data); 
    }
  }
);


const doctorSlices = createSlice({
  name: "doctor",
  initialState: {
    loading: false,
    appErr: null,
    appStatus: null,
    appStatusCode: null,
    serverErr: null,
    doctorAvailability: {},
  },
  extraReducers: (builder) => {
    builder.addCase(patientList.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(patientList.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(patientList.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(cancelPatientAppointment.pending, (state, action) => {
      state.loading = true;
      state.appErr = null;
      state.serverErr = null;
    });
    builder.addCase(cancelPatientAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = true;
      state.appErr = null;
      state.serverErr = null;
    });
    builder.addCase(cancelPatientAppointment.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action.payload;
      state.serverErr = action.error;
    });
    builder.addCase(getPatientAvailability.fulfilled, (state, action) => {
      state.appointmentList = action.payload;
      state.error = null;
    });

    builder.addCase(getZohoClientID.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getZohoClientID.fulfilled, (state, action) => {
      state.loading = false;
      state.availableDoctors = action.payload;
    });
    builder.addCase(getZohoClientID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getAvailableDoctorsForDate.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAvailableDoctorsForDate.fulfilled, (state, action) => {
      state.loading = false;
      state.availableDoctors = action.payload;
    });
    builder.addCase(getAvailableDoctorsForDate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getDoctorAvailabilityForDay.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDoctorAvailabilityForDay.fulfilled, (state, action) => {
      const { doctorId, data } = action.payload; // Destructure the payload to get doctorId and data

      // Clear the previous data and store the new data
      state.doctorAvailability = { [doctorId]: data };

      state.loading = false;
    });

    builder.addCase(getDoctorAvailabilityForDay.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(setPatientAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.appointmentConfirmation = action.payload; // Store the response data
      state.error = null;
    });
    builder.addCase(setPatientAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload; // Handle error state
    });
    builder.addCase(setPatientAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(codeGrantAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.appointmentConfirmation = action.payload; 
      state.error = null;
    });
    builder.addCase(codeGrantAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload; 
    });
    builder.addCase(codeGrantAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder
      .addCase(getUpcomingAppointments.pending, (state) => {
        state.loading = true; 
        state.appErr = null;
        state.serverErr = null;
      })
      .addCase(getUpcomingAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingAppointments = action.payload.records;
      })
      .addCase(getUpcomingAppointments.rejected, (state, action) => {
        state.loading = false;
        state.appErr = action.payload || "Failed to fetch upcoming appointments";
      });
  },
});

export default doctorSlices.reducer;
