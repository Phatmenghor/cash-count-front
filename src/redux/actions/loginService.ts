// // store/actions/userActions.ts
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import apiService from "../services/apiService";

import { LoginUserModel } from "@/models/login/LoginUserModel";
import { axiosNoAuth } from "@/utils/api/axios";
import TokenUtils from "@/utils/localStorage/token";

// // Async thunk for fetching user data
// export const fetchUserData = createAsyncThunk(
//   "user/fetchUserData",
//   async (userId: string, { rejectWithValue }) => {
//     try {
//       const response = await apiService.get(`/users/${userId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

interface LoginPayload {
  email: string;
  password: string;
}

export class LoginService {
  static loginUser = async (data: LoginPayload) => {
    try {
      const url = `/auth/auth-cpjson123bank/generateToken/${encodeURIComponent(
        data.email
      )}/${encodeURIComponent(data.password)}`;
      const response = await axiosNoAuth.get<LoginUserModel>(url);
      if (response.status === 200) {
        TokenUtils.setToken(response.data.userToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
}
