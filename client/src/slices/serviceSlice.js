import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../api";

const initialState = {
  services: [],
  isLoading: false,
};

export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (x, { rejectWithValue }) => {
    try {
      const response = await instance.get("/service");
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async (service) => {}
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (service) => {}
);

export const createService = createAsyncThunk(
  "services/createService",
  async (service) => {}
);

export const getServiceById = createAsyncThunk(
  "services/getServiceById",
  async (id) => {}
);

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchServices.pending]: (state, action) => {
      return { ...state, isLoading: true };
    },
    [fetchServices.fulfilled]: (state, action) => {
      return {
        ...state,
        services: action.payload.data,
        isLoading: false,
      };
    },
  },
});

export default serviceSlice.reducer;
