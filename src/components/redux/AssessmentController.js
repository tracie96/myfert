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
        transformedData,
        config,
      );

      console.log({ response });
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
        `${baseUrl}/Doctor/GetMedicalHistory/${id}`,
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
      console.log(response.data);
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
  readinessInfo: {},
  loading: false,
  error: null,
};

const intakeFormSlice = createSlice({
  name: "intake",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // For getGeneralInformation
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
  },
});

export default intakeFormSlice.reducer;
