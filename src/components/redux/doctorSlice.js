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
      console.log(response, 'responsessss');
      return response;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
    }
  },
);

export const fetchCareGivers = createAsyncThunk(
  "doctor/fetchCareGivers",
  async ({ page, size }, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Chat/GetCareGiverList/${page}/${size}`,
        config,
      );
      console.log('Care givers API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Care givers API error:', error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const getPatientBloodWork = createAsyncThunk(
  "doctor/getBloodWork",
  async ({ patientId, fileType }, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const url = `${baseUrl}Doctor/GetPatientDocument/${patientId}/${fileType}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const downloadBloodWork = createAsyncThunk(
  "doctor/downloadBloodWork",
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
        `${baseUrl}Doctor/DownloadDocument/${fileRef}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Download failed");
    }
  }
);
export const deletePatientBloodWork = createAsyncThunk(
  'doctor/deleteBloodWork',
  async (bloodWorkId, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    try {
      const response = await axios.get(
        `${baseUrl}Doctor/DeleteDocument/${bloodWorkId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.obj?.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addPatientBloodWork = createAsyncThunk(
  "doctor/addPatientBloodWork",
  async ({ patientRef, bloodWork }, { rejectWithValue, getState, dispatch }) => {
    console.log(patientRef, bloodWork)
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Doctor/AddPatientBloodWork`,
        { patientRef, bloodWork },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error?.response?.data, dispatch, user));
    }
  }
);

export const addPatientDocuments = createAsyncThunk(
  "doctor/addPatientDocuments",
  async ({ patientRef, bloodWork }, { rejectWithValue, getState, dispatch }) => {
    console.log("addPatientDocuments Thunk:", { patientRef, bloodWork }); 

    const user = getState()?.authentication?.userAuth; 
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Doctor/AddPatientDocument`, 
        { patientRef, document: bloodWork }, 
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

export const getPatientMed = createAsyncThunk(
  'doctor/getPatientMed',
  async (patientId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    try {
      const response = await axios.get(`${baseUrl}Doctor/GetPatientMed/${patientId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.obj?.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const addPatientMed = createAsyncThunk(
  "doctor/addPatientMed",
  async ({ drugName, dose, amount, route, frequency, patientRef }, { rejectWithValue, getState, dispatch }) => {
    console.log(drugName, dose, amount, route, frequency, patientRef);

    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Doctor/AddPatientMed`,
        { drugName, dose, amount, route, frequency, patientRef },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error?.response?.data, dispatch, user));
    }
  }
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
export const acceptAppointment = createAsyncThunk(
  "doctor/acceptAppointment",
  async ({ appointmentId, status }, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;

    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Doctor/AcceptAppointment/${appointmentId}/${status}`,
        config
      );
      return response.data; // Return the response data to be used by reducers
    } catch (error) {

      return rejectWithValue(error?.response?.data);
    }
  }
);
export const increaseUserStep = createAsyncThunk(
  "doctor/increaseUserStep",
  async ({ patientId, step }, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseUrl}Doctor/MarkPatientStep/${patientId}/${step}`,
        config
      );
      return response.data; // Assuming the API returns JSON data
    } catch (error) {
      handleApiError(error?.response?.data, dispatch, user);
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

export const getUpcomingAppointmentForDoctor = createAsyncThunk(
  "doctor/getUpcomingAppointmentForDoctor",
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
        `${baseUrl}Doctor/GetAllAppointment`,
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
  async ({ appointmentId, code }, { rejectWithValue, getState, dispatch }) => {
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

export const createMeeting = createAsyncThunk(
  "user/createMeeting",
  async ({ appointmentId, code }, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const appointmentIdNumber = Number(appointmentId);
    const config = {
      headers: {
        Authorization: `Bearer ${users?.obj?.token}`,
      },
    };

    try {
      const url = `${baseUrl}Doctor/CreateZohoMeeting`;
      //  const locationUrl = new URLSearchParams(code);
      //  const currentLocation = locationUrl.get('location');
      //  console.log('updatedCode',currentLocation)
      //  if(currentLocation == 'in') {
      //    locationUrl.set('location', 'ca'); // Set the location to 'CA' for Canada
      //  }

      //  // Reconstruct the full URL with the updated location
      //  const updatedCode = locationUrl.toString();

      const response = await axios.post(url, { appointmentId: appointmentIdNumber, url: code }, config);
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
        `${baseUrl}Doctor/GetAllAppointment`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  "doctor/cancelAppointment",
  async (appointmentId, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Doctor/CancelAppointment/${appointmentId}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateAvailability = createAsyncThunk(
  "doctor/updateAvailability",
  async ({ start, end, appointID }, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Doctor/UpdateAvailability`,
        { start, end, appointID },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  "doctor/deleteAppointment",
  async (appointmentId, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Doctor/DeleteAppointment/${appointmentId}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchPatientNotes = createAsyncThunk(
  'doctor/fetchPatientNotes',
  async (patientId, { rejectWithValue,getState }) => {
    const user = getState()?.authentication?.userAuth;

    try {
      const response = await fetch(
        `${baseUrl}Doctor/GetPatientNotes/${patientId}`,
        {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
            Authorization: `Bearer ${user?.obj?.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch patient notes');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addPatientNotes = createAsyncThunk(
  "doctor/addPatientNotes",
  async ({ personalNote, subjective, objective, assessment, patientPlan, appointmentType, isDraft, patientRef }, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Doctor/AddPatientNotes`,
        { personalNote, subjective, objective, assessment, patientPlan, appointmentType, patientRef, isDraft },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error?.response?.data, dispatch, user));
    }
  }
);

export const editPatientNote = createAsyncThunk(
  "doctor/editPatientNote",
  async ({ personalNote, subjective, objective, assessment, patientPlan, noteId }, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    console.log(personalNote,subjective,objective,patientPlan ,assessment,'lll')
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Doctor/EditPatientNote`,
        { personalNote, subjective, objective, assessment, patientPlan, noteId },
        config
      );
      return response.data;
    } catch (error) {
      console.log({error})
      return rejectWithValue(handleApiError(error?.response?.data, dispatch, user));
    }
  }
);

export const deletePatientNote = createAsyncThunk(
  "doctor/deletePatientNote",
  async (noteId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    console.log({noteId})
    const config = {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Doctor/DeletePatientNote/${noteId}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error?.response?.data, dispatch, user));
    }
  }
);

export const fetchDocumo = createAsyncThunk(
  "doctor/fetchDocumo",
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
        `${baseUrl}Doctor/FetchDocumo`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const downloadDocumo = createAsyncThunk(
  "doctor/downloadDocumo",
  async (messageNumber, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
      responseType: "blob", // Important for handling file downloads
    };

    try {
      const response = await axios.get(
        `${baseUrl}Doctor/DownloadDocumo/${messageNumber}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Download failed");
    }
  }
);

export const getPatientSupplements = createAsyncThunk(
  'doctor/getPatientSupplements',
  async (patientId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    try {
      const response = await axios.get(`${baseUrl}Doctor/GetPatientSupplements/${patientId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.obj?.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addPatientSupplement = createAsyncThunk(
  "doctor/addPatientSupplement",
  async ({ supplementName, dose, metric, amount, amountExtra, route, frequency, notes, patientRef }, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Doctor/AddPatientSupplements`,
        { supplementName, dose, metric, amount, amountExtra, route, frequency, notes, patientRef },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error?.response?.data, dispatch, user));
    }
  }
);

export const getMessages = createAsyncThunk(
  "doctor/getMessages",
  async (userRef, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Chat/GetMessages/${userRef}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "doctor/sendMessage",
  async ({ userRef, chat, chatRef }, { rejectWithValue, getState }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.obj?.token}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Chat/SendMessage`,
        { userRef, chat, chatRef },
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
    patientList: [],
    careGivers: [],
    upcomingPatientAppointment: [],
    doctorAvailability: {},
    bloodWork: [],
    medStatus: null,
    medError: null,
    medications: [],
    patientNotes: [],
    loadingNotes: false,
    notesError: null,
    editingNote: false,
    editNoteError: null,
    deletingNote: false,
    deleteNoteError: null,
    documoData: [],
    documoLoading: false,
    documoError: null,
    supplements: [],
    bloodWorkFile1: null,
    bloodWorkFile2: null,
    messages: null,
    chatRef: null,
    chatLoading: false,
    chatError: null,
  },
  reducers: {
    // Add a reducer for optimistic message updates
    addMessage: (state, action) => {
      if (state.messages?.chats) {
        state.messages.chats.push(action.payload.newMessage);
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(patientList.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(patientList.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
      state.patientList = action.payload?.data || [];
    });
    builder.addCase(patientList.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
      state.patientList = [];
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
      state.upcomingPatientAppointment = state.upcomingPatientAppointment.filter(
        (appointment) => appointment.appointId !== action.payload
      );
    });
    builder.addCase(cancelPatientAppointment.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action.payload;
      state.serverErr = action.error;
    });
    builder.addCase(cancelAppointment.pending, (state, action) => {
      state.loading = true;
      state.appErr = null;
      state.serverErr = null;
    });
    builder
      .addCase(deletePatientBloodWork.fulfilled, (state, action) => {
        state.bloodWork = state.bloodWork.filter(file => file.fileRef !== action.meta.arg);
      })
      .addCase(deletePatientBloodWork.rejected, (state, action) => {
        state.error = action.payload;
      });
    builder.addCase(cancelAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = true;
      state.appErr = null;
      state.serverErr = null;
    });
    builder.addCase(cancelAppointment.rejected, (state, action) => {
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
      state.zohoClientId = action.payload;
    });
    builder.addCase(getZohoClientID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getUpcomingAppointmentForDoctor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUpcomingAppointmentForDoctor.fulfilled, (state, action) => {
      state.loading = false;
      state.appointmentForDoctor = action.payload;
    });
    builder.addCase(getUpcomingAppointmentForDoctor.rejected, (state, action) => {
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
      .addCase(getPatientBloodWork.pending, (state) => {
        state.bloodWorkStatus = 'loading';
      })
      .addCase(getPatientBloodWork.fulfilled, (state, action) => {
        state.bloodWorkStatus = 'succeeded';
        state.bloodWork = action.payload;
      })
      .addCase(getPatientBloodWork.rejected, (state, action) => {
        state.bloodWorkStatus = 'failed';
        state.bloodWorkError = action.error.message || "Something went wrong";
      });

    builder
      .addCase(getPatientMed.pending, (state) => {
        state.medStatus = 'loading';
      })
      .addCase(getPatientMed.fulfilled, (state, action) => {
        state.medStatus = 'succeeded';
        state.medications = action.payload;
      })
      .addCase(getPatientMed.rejected, (state, action) => {
        state.medStatus = 'failed';
        state.medError = action.error.message || "Something went wrong";
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

    builder.addCase(createMeeting.fulfilled, (state, action) => {
      state.loading = false;
      state.createMeetingData = action.payload;
      state.error = null;
    });
    builder.addCase(createMeeting.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(createMeeting.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder
      .addCase(updateAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // You might want to update the availability in your state here
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Remove the deleted appointment from the state
        if (state.upcomingAppointments) {
          state.upcomingAppointments = state.upcomingAppointments.filter(
            appointment => appointment.appointId !== action.meta.arg
          );
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchPatientNotes.pending, (state) => {
        state.loadingNotes = true;
        state.notesError = null;
      })
      .addCase(fetchPatientNotes.fulfilled, (state, action) => {
        state.loadingNotes = false;
        state.patientNotes = action.payload;
      })
      .addCase(fetchPatientNotes.rejected, (state, action) => {
        state.loadingNotes = false;
        state.notesError = action.payload;
      });

    builder
      .addCase(editPatientNote.pending, (state) => {
        state.editingNote = true;
        state.editNoteError = null;
      })
      .addCase(editPatientNote.fulfilled, (state, action) => {
        state.editingNote = false;
        // Update the note in the patientNotes array
        const updatedNoteIndex = state.patientNotes.findIndex(note => note.noteId === action.payload.noteId);
        if (updatedNoteIndex !== -1) {
          state.patientNotes[updatedNoteIndex] = {
            ...state.patientNotes[updatedNoteIndex],
            ...action.payload
          };
        }
      })
      .addCase(editPatientNote.rejected, (state, action) => {
        state.editingNote = false;
        state.editNoteError = action.payload;
      });

    builder
      .addCase(deletePatientNote.pending, (state) => {
        state.deletingNote = true;
        state.deleteNoteError = null;
      })
      .addCase(deletePatientNote.fulfilled, (state, action) => {
        state.deletingNote = false;
        // Remove the deleted note from the patientNotes array
        state.patientNotes = state.patientNotes.filter(note => note.noteId !== action.meta.arg);
      })
      .addCase(deletePatientNote.rejected, (state, action) => {
        state.deletingNote = false;
        state.deleteNoteError = action.payload;
      });

    builder
      .addCase(fetchDocumo.pending, (state) => {
        state.documoLoading = true;
        state.documoError = null;
      })
      .addCase(fetchDocumo.fulfilled, (state, action) => {
        state.documoLoading = false;
        state.documoData = action.payload;
        state.documoError = null;
      })
      .addCase(fetchDocumo.rejected, (state, action) => {
        state.documoLoading = false;
        state.documoError = action.payload;
      });

    // Get Patient Supplements
    builder.addCase(getPatientSupplements.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPatientSupplements.fulfilled, (state, action) => {
      state.loading = false;
      state.supplements = action.payload;
    });
    builder.addCase(getPatientSupplements.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add Patient Supplement
    builder.addCase(addPatientSupplement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addPatientSupplement.fulfilled, (state, action) => {
      state.loading = false;
      if (state.supplements) {
        state.supplements.push(action.payload);
      } else {
        state.supplements = [action.payload];
      }
    });
    builder.addCase(addPatientSupplement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add Care Givers
    builder.addCase(fetchCareGivers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCareGivers.fulfilled, (state, action) => {
      console.log('Care givers reducer payload:', action.payload);
      state.loading = false;
      state.careGivers = action.payload || [];
    });
    builder.addCase(fetchCareGivers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.careGivers = [];
    });

    // Get Messages
    builder.addCase(getMessages.pending, (state) => {
      state.chatLoading = true;
      state.chatError = null;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.chatLoading = false;
      state.messages = action.payload;
      state.chatRef = action.payload.chatReference;
      state.chatError = null;
    });
    builder.addCase(getMessages.rejected, (state, action) => {
      state.chatLoading = false;
      state.chatError = action.payload;
    });

    // Send Message
    builder.addCase(sendMessage.pending, (state) => {
      state.chatLoading = true;
      state.chatError = null;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.chatLoading = false;
      state.chatError = null;
      // Message already added optimistically, no need to add again
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.chatLoading = false;
      state.chatError = action.payload;
      // Could add logic here to remove the optimistically added message
    });
  },
});

export const { addMessage } = doctorSlices.actions;
export default doctorSlices.reducer;
