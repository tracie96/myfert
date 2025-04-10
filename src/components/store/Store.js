import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import AuthController from "../redux/AuthController";
// import AdminController from "../redux/adminSlice";
import UserHistoryController from "../redux/userSlice";
import TableSlice from "../redux/tableSlice";
import globalSlice from "../redux/globalSlice";
import doctorSlice from "../redux/doctorSlice";
import assessmentSlice from "../redux/assessmentSlice";
import intakeFormSlice from "../redux/AssessmentController";
import SubscriptionSlice from "../redux/subscriptionSlice";
import patientSlice from "../redux/patientSlice";
import profileSlice from "../redux/profileSlice";

const allReducers = combineReducers({
  authentication: AuthController,
  doctor: doctorSlice,
  // admin: AdminController,
  userHistory: UserHistoryController,
  globalSlice: globalSlice,
  tableSlice: TableSlice,
  assessment: assessmentSlice,
  intake: intakeFormSlice,
  subscription: SubscriptionSlice,
  patient: patientSlice,
  profile: profileSlice
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["authentication"],
};

const persistedReducer = persistReducer(persistConfig, allReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
});

export const persistor = persistStore(store);
