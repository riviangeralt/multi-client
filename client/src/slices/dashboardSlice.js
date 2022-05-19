import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../api";

const initialState = {
  socials: [],
  dashboardData: {},
  orders: [],
};

export const getDashboard = createAsyncThunk(
  "dashboard/getDashboard",
  async (x, { rejectWithValue }) => {
    try {
      const response = await instance.get("/dashboard");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addSocial = createAsyncThunk(
  "dashboard/addSocial",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post("/add/social", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getSocials = createAsyncThunk(
  "dashboard/getSocials",
  async (x, { rejectWithValue }) => {
    try {
      const response = await instance.get("/socials");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getOrders = createAsyncThunk(
  "dashboard/getOrders",
  async (x, { rejectWithValue }) => {
    try {
      const response = await instance.get("/orders");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: {
    [getDashboard.fulfilled]: (state, action) => {
      return {
        ...state,
        dashboardData: action.payload.data,
      };
    },
    [addSocial.fulfilled]: (state, action) => {
      return {
        ...state,
        socials: action.payload.data,
      };
    },
    [getSocials.fulfilled]: (state, action) => {
      return {
        ...state,
        socials: action.payload.data.map((social) => {
          let obj = {
            id: social._id,
            name: social.socialName,
            link: social.socialLink,
            slug: social.slug,
          };
          return obj;
        }),
      };
    },
    [getOrders.fulfilled]: (state, action) => {
      return {
        ...state,
        orders: action.payload.data,
      };
    },
  },
});

export default dashboardSlice.reducer;
