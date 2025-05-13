import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/envAccess";
import { handleApiError } from "../Handler/ExceptionHandler";

export const submitGeneralInformation = createAsyncThunk(
  "user/submitGeneralInformation",
  async (transformedData, { getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;
    const config = {
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}/Patient/AddGeneralInformation`,
        transformedData.payload,
        config,
      );
        return response.data
    } catch (error) {
      console.log({ error });
    }
  },
);

export const getGeneralInformation = createAsyncThunk(
  "Doctor/GetGeneralInformation",
  async (id, { getState }) => {
    console.log("i got here");
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetGeneralInformation/${id}`,
        config,
      );

      console.log(response);
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getGeneralInformationPatient = createAsyncThunk(
  "Patient/GetGeneralInformation", // Unique action type prefix
  async (_, { getState }) => { //  No id parameter needed, use _ to indicate unused parameter
      console.log("Fetching access details...");

      const user = getState()?.authentication?.userAuth;
      const token = user?.obj?.token;

      const config = {
          headers: {
              accept: "text/plain",
              Authorization: `Bearer ${token}`,
          },
      };

      try {
          const response = await axios.get(
              `${baseUrl}/Patient/GetGeneralInformation`,
              config,
          );

          console.log("Access details response:", response);
          return response.data;
      } catch (error) {
          console.error("Error fetching access details:", error);
          return handleApiError(error); // Use the error handling function
      }
  },
);

export const getAccessDetails = createAsyncThunk(
  "Patient/GetAccessDetails", // Unique action type prefix
  async (_, { getState }) => { //  No id parameter needed, use _ to indicate unused parameter
      console.log("Fetching access details...");

      const user = getState()?.authentication?.userAuth;
      const token = user?.obj?.token;

      const config = {
          headers: {
              accept: "text/plain",
              Authorization: `Bearer ${token}`,
          },
      };

      try {
          const response = await axios.get(
              `${baseUrl}/Patient/GetAccessDetails`,
              config,
          );

          console.log("Access details response:", response);
          return response.data;
      } catch (error) {
          console.error("Error fetching access details:", error);
          return handleApiError(error); // Use the error handling function
      }
  },
);
export const getCurrentHealthLifestyle = createAsyncThunk(
  "user/getCurrentHealthLifestyle",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetHealthLifestyle/${id}`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getNutritionAndDietaryHabits = createAsyncThunk(
  "user/getNutritionAndDietaryHabits",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetNutrition/${id}`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getSubstanceAbuse = createAsyncThunk(
  "user/getSubstanceUse",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetSubstanceUse/${id}`,
        config,
      );
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getGetStress = createAsyncThunk(
  "user/getStress",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetStress/${id}`,
        config,
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getHealthandMedical = createAsyncThunk(
  "user/getHealth",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetHealthMedicalHistory/${id}`,
        config,
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getPersonalFamily = createAsyncThunk(
  "user/getPersonalFamily",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetPersonalFamily/${id}`,
        config,
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getIllnessCondition = createAsyncThunk(
  "user/getIllnessCondition",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetIllnessConditions/${id}`,
        config,
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getReproductiveReview = createAsyncThunk(
  "user/getReproductiveReview",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetReproductiveHealth/${id}`,
        config,
      );
      console.log({ response});
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getSymptomReview = createAsyncThunk(
  "user/getSymptomReview",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetSymptoms/${id}`,
        config,
      );
      console.log({ response});
      return response.data;
    } catch (error) {
      console.log({ error });
      return handleApiError(error);
    }
  },
);

export const getReadiness = createAsyncThunk(
  "user/getReadiness",
  async (id, { getState }) => {
    const user = getState()?.authentication?.userAuth;
    const token = user?.obj?.token;

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/Doctor/GetReadiness/${id}`,
        config
      );

      const data = {
        modifyDiet: 0,
        takeDailySupplement: 0,
        recordEverythingEat: 0,
        modifyLifestyle: 0,
        practiceRelaxation: 0,
        engageRegularExercise: 0,
        readinessConfident: {
          level: 0,
          name: "string",
        },
        readinessSupportive: 0,
        readinessFrequency: 0,
        comment: "string",
        healthAchieve: "string",
        healthLastTime: "string",
        healthChangeTrigger: "string",
        healthFeelBetter: "string",
        healthFeelWorse: "string",
        healthCondition: "string",
        healthThinkHappening: "string",
        healthHappenGetBetter: "string",
      };

      console.log(response.data);
      return response.data || data; 
    } catch (error) {
      console.error("API Error:", error);
      return handleApiError(error);
    }
  }
);

const initialState = {
  generalInfo: {},
  healthLifestyle: {},
  nuritionInfo: {},
  substanceInfo: {},
  stressInfo: {},
  healthMedicalInfo: {},
  personalFamilyInfo: {},
  illnessInfo: {},
  symptomInfo: {},
  reproductiveInfo:{},
  readinessInfo: {},
  loading: false,
  error: null,
  accessDetails: {},
  patientGeneralInfo:{},
};

const intakeFormSlice = createSlice({
  name: "intake",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // For getGeneralInformation
    builder
      .addCase(getGeneralInformationPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGeneralInformationPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patientGeneralInfo = action.payload; // Set the fetched data
      })
      .addCase(getGeneralInformationPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(getGeneralInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGeneralInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.generalInfo = action.payload; // Set the fetched data
      })
      .addCase(getGeneralInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(getCurrentHealthLifestyle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentHealthLifestyle.fulfilled, (state, action) => {
        state.loading = false;
        state.healthLifestyle = action.payload;
      })
      .addCase(getCurrentHealthLifestyle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getNutritionAndDietaryHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNutritionAndDietaryHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.nuritionInfo = action.payload;
      })
      .addCase(getNutritionAndDietaryHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getSubstanceAbuse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubstanceAbuse.fulfilled, (state, action) => {
        state.loading = false;
        state.substanceInfo = action.payload;
      })
      .addCase(getSubstanceAbuse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getGetStress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGetStress.fulfilled, (state, action) => {
        state.loading = false;
        state.stressInfo = action.payload;
      })
      .addCase(getGetStress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

      builder
      .addCase(getHealthandMedical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHealthandMedical.fulfilled, (state, action) => {
        state.loading = false;
        state.healthMedicalInfo = action.payload;
      })
      .addCase(getHealthandMedical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getPersonalFamily.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPersonalFamily.fulfilled, (state, action) => {
        state.loading = false;
        state.personalFamilyInfo = action.payload;
      })
      .addCase(getPersonalFamily.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getIllnessCondition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIllnessCondition.fulfilled, (state, action) => {
        state.loading = false;
        state.illnessInfo = action.payload;
      })
      .addCase(getIllnessCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getSymptomReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSymptomReview.fulfilled, (state, action) => {
        state.loading = false;
        state.symptomInfo = action.payload;
      })
      .addCase(getSymptomReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

      builder
      .addCase(getReproductiveReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReproductiveReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reproductiveInfo = action.payload;
      })
      .addCase(getReproductiveReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getReadiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReadiness.fulfilled, (state, action) => {
        state.loading = false;
        state.readinessInfo = action.payload;
      })
      .addCase(getReadiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

      builder
      .addCase(getAccessDetails.pending, (state) => {
          state.loading = true;
          state.error = null;
      })
      .addCase(getAccessDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.accessDetails = action.payload;
      })
      .addCase(getAccessDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || 'Failed to fetch access details.'; // Access the message from the error object
      });
  },
});

export default intakeFormSlice.reducer;
