import { axiosWithAuth } from "@/utils/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfile } from "../models/userManagement/UserProfileModel";

class UserService {
  static getUserData = createAsyncThunk<
    UserProfile,
    void,
    { rejectValue: string }
  >("user/fetchUser", async (_, { rejectWithValue }) => {
    try {
      const response = await axiosWithAuth.get(`/auth/get-user-info-by-token`);
      return response.data.data;
    } catch {
      return rejectWithValue("Failed to fetch user data");
    }
  });
}

export default UserService;
