// import { createAsyncThunk } from "@reduxjs/toolkit";
// import apiService from "../services/apiService";

import { LoginUserModel } from "@/redux/models/login/LoginUserModel";
import { axiosNoAuth } from "@/utils/api/axios";
import TokenStorage from "@/utils/localStorage/tokenStorage";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import axios from "axios";

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
      const response = await axiosNoAuth.get(url);
      if (response.status === 200) {
        TokenStorage.setToken(response.data.data.userToken);
        UserRoleStorage.setUserRole(response.data.data.roleName);
        return {
          success: true,
          data: response.data.data.roleName,
        };
      }
      return {
        success: false,
        status: 400,
        data: "Login failed. Please try again.",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          return {
            success: false,
            status: 404,
            data: "We couldn't find an account with that username. Please try again or crated new account.",
          };
        }
        return {
          success: false,
          status: 400,
          data: "Login failed. Please try again.",
        };
      }
      return {
        success: false,
        status: 400,
        data: "An unexpected error occurred. Please check your connection.",
      };
    }
  };
}
