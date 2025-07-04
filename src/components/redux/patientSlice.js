import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../Handler/ExceptionHandler";
import { toast } from "react-toastify";
import { baseUrl } from "../../utils/envAccess";

export const addDocuments = createAsyncThunk(
  "patient/addDocument",
  async ({ patientRef, bloodWork }, { rejectWithValue, getState, dispatch }) => {

    const user = getState()?.authentication?.userAuth; 
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}patient/addDocument`, 
        { ...bloodWork }, 
        config
      );
      console.log("API Response:", response.data); 
      return response.data;

    } catch (error) {
      console.error("API Error:", error); 
      return rejectWithValue(handleApiError(error?.response?.data, dispatch, user)); 
    }
  }
);

export const getDoctorListDropdownForAppointment = createAsyncThunk(
  "patient/getDoctorListDropdownForAppointment",
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
        `${baseUrl}Appointment/GetDoctorListDropdownForAppointment`,
        config,
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  },
);
export const increaseUserStep = createAsyncThunk(
  "patient/increaseUserStep",
  async ({ step }, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Patient/UpdatePatientStep/${step}`,
        config
      );
      return response.data;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);
export const getPatientStatus = createAsyncThunk(
  "patient/getPatientStatus",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "accept": "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetPatientStatus`,
        config
      );
      console.log(response)
      return response.data;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);
export const getPatientLabs = createAsyncThunk(
  "patient/getPatientLabs",
  async (fileType, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "accept": "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetPatientDocument/${fileType}`,
        config
      );
      console.log(response);
      return response.data;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

export const getPatientBloodWork = createAsyncThunk(
  "patient/getPatientBloodWork",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "accept": "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetPatientBloodWork`,
        config
      );
      console.log(response);
      return response.data;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

export const getDoctorAvailableSlotsForAppointment = createAsyncThunk(
  "patient/getDoctorAvailableSlotsForAppointment",
  async (obj, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Appointment/GetDoctorAvailableTimeSlotsForAppointment?appointmentDate=${obj.appointmentStartDate}&doctorId=${obj.doctorId}`,
        config,
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  },
);

export const getAvailability = createAsyncThunk(
  "availability/getAvailability",
  async ({ doctorId, month, year }, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Doctor/GetAvailability/${doctorId}/${month}/${year}`,
        config,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const addAppointment = createAsyncThunk(
  "patient/addAppointment",
  async (users, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("title", users.title);
    formData.append("description", users.description);
    formData.append("appointmentStartDate", users.appointmentStartDate);
    formData.append("appointmentStartTime", users.appointmentStartTime);
    formData.append("doctorId", users.doctorId);
    formData.append("patientId", users.patientId);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Appointment/AddAppointment`,
        formData,
        config,
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  },
);

export const getPatientMed = createAsyncThunk(
  "patient/getPatientMed",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "accept": "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetPatientMed`,
        config
      );
      console.log(response);
      return response.data;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

export const downloadBloodWork = createAsyncThunk(
  "patient/downloadBloodWork",
  async (fileRef, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
      responseType: "blob",
    };

    try {
      const response = await axios.get(
        `${baseUrl}Patient/DownloadDocument/${fileRef}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Download failed");
    }
  }
);


export const updateAppointment = createAsyncThunk(
  "patient/updateAppointment",
  async (appointment, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Appointment/UpdateAppointment`,
        appointment,
        config,
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
      rejectWithValue(error);
    }
  },
);

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
        config,
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  },
);

export const getUpcomingAppointments = createAsyncThunk(
  "patient/getUpcomingAppointments",
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
        `${baseUrl}Patient/GetUpComingAppointment`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
//#endregion

export const getPatientNotes = createAsyncThunk(
  "patient/getPatientNotes",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "accept": "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetPatientNotes`,
        config
      );
      return response.data;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

export const getPatientSupplements = createAsyncThunk(
  "patient/getPatientSupplements",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "accept": "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Patient/GetPatientSupplements`,
        config
      );
      console.log(response);
      return response.data;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

const patientSlices = createSlice({
  name: "patient",
  initialState: {
    patientLoading: false,
    patientAppErr: null,
    patientAppStatus: null,
    patientAppStatusCode: null,
    patientServerErr: null,
    bloodWork: [],
    medication: [],
    supplements: [],
    notes: []
  },
  extraReducers: (builder) => {
    builder.addCase(
      getDoctorListDropdownForAppointment.pending,
      (state, action) => {
        state.patientLoading = true;
        state.patientAppErr = undefined;
        state.patientAppStatus = undefined;
        state.patientAppStatusCode = undefined;
        state.patientServerErr = undefined;
      },
    );
    builder.addCase(
      getDoctorListDropdownForAppointment.fulfilled,
      (state, action) => {
        state.patientLoading = false;
        state.patientAppStatus = false;
        state.patientAppErr = undefined;
        state.patientAppStatusCode = undefined;
        state.patientServerErr = undefined;
      },
    );
    builder.addCase(
      getDoctorListDropdownForAppointment.rejected,
      (state, action) => {
        state.patientAppErr = action?.payload?.message;
        state.patientLoading = false;
        state.patientServerErr = undefined;
        state.patientAppStatus = action?.payload?.status;
        state.patientAppStatusCode = action?.payload?.statusCode;
      },
    );

    builder.addCase(
      getDoctorAvailableSlotsForAppointment.pending,
      (state, action) => {
        state.patientLoading = true;
        state.patientAppErr = undefined;
        state.patientAppStatus = undefined;
        state.patientAppStatusCode = undefined;
        state.patientServerErr = undefined;
      },
    );
    builder.addCase(
      getDoctorAvailableSlotsForAppointment.fulfilled,
      (state, action) => {
        state.patientLoading = false;
        state.patientAppStatus = false;
        state.patientAppErr = undefined;
        state.patientAppStatusCode = undefined;
        state.patientServerErr = undefined;
      },
    );
    builder.addCase(
      getDoctorAvailableSlotsForAppointment.rejected,
      (state, action) => {
        state.patientAppErr = action?.payload?.message;
        state.patientLoading = false;
        state.patientServerErr = undefined;
        state.patientAppStatus = action?.payload?.status;
        state.patientAppStatusCode = action?.payload?.statusCode;
      },
    );

    builder.addCase(addAppointment.pending, (state, action) => {
      state.patientLoading = true;
      state.patientAppErr = undefined;
      state.patientAppStatus = undefined;
      state.patientAppStatusCode = undefined;
      state.patientServerErr = undefined;
    });
    builder.addCase(addAppointment.fulfilled, (state, action) => {
      state.patientLoading = false;
      state.patientAppStatus = false;
      state.patientAppErr = undefined;
      state.patientAppStatusCode = undefined;
      state.patientServerErr = undefined;
    });
    builder.addCase(addAppointment.rejected, (state, action) => {
      state.patientAppErr = action?.payload?.message;
      state.patientLoading = false;
      state.patientServerErr = undefined;
      state.patientAppStatus = action?.payload?.status;
      state.patientAppStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(updateAppointment.pending, (state, action) => {
      state.patientLoading = true;
      state.patientAppErr = undefined;
      state.patientAppStatus = undefined;
      state.patientAppStatusCode = undefined;
      state.patientServerErr = undefined;
    });
    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      state.patientLoading = false;
      state.patientAppStatus = action?.payload?.status;
      state.patientAppErr = action?.payload?.message;
      state.patientAppStatusCode = action?.payload?.statusCode;
      state.patientServerErr = action?.error?.message;
    });
    builder.addCase(updateAppointment.rejected, (state, action) => {
      state.patientLoading = false;
      state.patientAppErr = action?.payload?.message;
      state.patientServerErr = action?.error?.message;
      state.patientAppStatus = action?.payload?.status;
      state.patientAppStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(getPreviewLinkList.pending, (state, action) => {
      state.patientLoading = true;
      state.patientAppErr = undefined;
      state.patientAppStatus = undefined;
      state.patientAppStatusCode = undefined;
      state.patientServerErr = undefined;
    });

    builder
      .addCase(getPatientLabs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPatientLabs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bloodWork = action.payload;
      })
      .addCase(getPatientLabs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    builder
      .addCase(getPatientMed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPatientMed.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.medication = action.payload;
      })
      .addCase(getPatientMed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
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
    builder
      .addCase(getUpcomingAppointments.pending, (state, action) => {
        state.patientLoading = false;
        state.patientAppErr = action?.payload?.message;
        state.patientServerErr = action?.error?.message;
        state.patientAppStatus = action?.payload?.status;
        state.patientAppStatusCode = action?.payload?.statusCode;
      })
      .addCase(getUpcomingAppointments.fulfilled, (state, action) => {
        state.patientLoading = false;
        state.patientAppErr = action?.payload?.message;
        state.patientServerErr = action?.error?.message;
        state.upcomingPatientAppointment = action?.payload?.records;
        state.patientAppStatusCode = action?.payload?.statusCode;
      })
    builder
      .addCase(getPatientStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatientStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(getPatientStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getPatientNotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPatientNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = action.payload;
      })
      .addCase(getPatientNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    builder
      .addCase(getPatientSupplements.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPatientSupplements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.supplements = action.payload;
      })
      .addCase(getPatientSupplements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

  },
});

export default patientSlices.reducer;
