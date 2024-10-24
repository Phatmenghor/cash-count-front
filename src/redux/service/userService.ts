import { axiosWithAuth } from "@/utils/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosWithAuth.get(`/auth/get-user-info-by-token`);
      console.log("### ====re", response.data.data);
      return response.data;
    } catch {
      return rejectWithValue(null);
    }
  }
);
