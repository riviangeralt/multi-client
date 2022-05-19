import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "../slices/authSlice";
import dashboardSlice from "../slices/dashboardSlice";
// import { dashboardApi } from "../slices/dashboard";
import serviceSlice from "../slices/serviceSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  dashboard: dashboardSlice,
  // [dashboardApi.reducerPath]: dashboardApi.reducer,
  service: serviceSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(dashboardApi.middleware),
});

// setupListeners(store.dispatch);

export default store;
