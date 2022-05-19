import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../api";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isVerified: false,
  error: null,
  user: null,
  token: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post("/login", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const signupAll = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const { isMerchant, newData } = data;
      const response = await instance.post(
        `/register/${isMerchant ? "merchant" : "user"}`,
        newData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifyAll = createAsyncThunk(
  "auth/verify",
  async (data, { rejectWithValue }) => {
    try {
      const { id, token, isMerchant } = data;
      const response = await instance.get(
        `/${isMerchant ? "merchant" : "user"}/verify/${id}/${token}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "auth/resend",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post("/send-email", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post("/forgot-password", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/change-password",
  async (data, { rejectWithValue }) => {
    try {
      const { id, token, password, type } = data;
      const response = await instance.post(`/change-password/${id}/${token}`, {
        password,
        type,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/logout`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/google-login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post("/google-login", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [login.pending]: (state) => {
      state.isLoading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isVerified =
        action.payload.type === "merchant"
          ? action.payload.merchant.isVerified
          : action.payload.user.isVerified;
      state.type = action.payload.type;
      state.token = action.payload.token;
      state.user =
        action.payload.type === "merchant"
          ? action.payload.merchant
          : action.payload.user;
      state.error = null;
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message;
    },
    [verifyAll.pending]: (state) => {
      state.isLoading = true;
    },
    [verifyAll.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        isVerified: action.payload.status === "success" ? true : false,
      };
    },
    [verifyAll.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message;
    },
    [logout.fulfilled]: (state, action) => {
      return initialState;
    },
    [loginWithGoogle.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        isVerified: action.payload.isVerified,
        type: action.payload.type,
        token: action.payload.token,
        user:
          action.payload.type === "merchant"
            ? action.payload.merchant
            : action.payload.user,
        error: null,
      };
    },
  },
});

export default authSlice.reducer;
