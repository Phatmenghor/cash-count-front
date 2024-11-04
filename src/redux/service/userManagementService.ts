import { axiosWithAuth } from "@/utils/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfile } from "../models/userManagement/UserProfileModel";
import { UserRole } from "@/constants/userRole";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";

interface getUserParams {
  pageSize?: number;
  currentPage?: number;
  search?: string;
}

interface updateStatusParams {
  id: number;
  status: number;
}

interface getUserByIdParams {
  id: number;
}

interface updateUserByIdParams {
  id: number;
  info: updateUserInfo;
}

interface updateUserInfo {
  name: string;
  roleId: number;
  branchId: number;
  departmentId: string;
  positionId: string;
}

class UserManagementService {
  static getUserByToken = createAsyncThunk<
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

  static getAllUsers = async ({
    pageSize = 15,
    currentPage = 1,
    search = "",
  }: getUserParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/admin/get-user-all?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch {
      return { data: [], pagination: null };
    }
  };

  static updateUserStatus = async (param: updateStatusParams) => {
    try {
      await axiosWithAuth.get(
        `/api/admin/user-update-status/${param.id}?status=${param.status}`
      );
      return true;
    } catch {
      return false;
    }
  };

  static getUserByID = async ({ id }: getUserByIdParams) => {
    try {
      const response = await axiosWithAuth.get(`/auth/get-user-info/${id}`);
      return response.data.data;
    } catch {
      return null;
    }
  };

  static updateUserById = async (param: updateUserByIdParams) => {
    try {
      const res = await axiosWithAuth.post(
        `/auth/update-user-info/${param.id}`,
        param.info
      );

      return true;
    } catch {
      return false;
    }
  };

  static getUserRequest = async ({
    pageSize = 15,
    currentPage = 1,
    search = "",
  }: getUserParams) => {
    try {
      const userRole = UserRoleStorage.getUserRole();
      if (userRole == UserRole.IT_ADMIN_USER) {
        const response = await axiosWithAuth.get(
          `/api/admin/get-all-user-authorize?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
        );
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      } else if (userRole == UserRole.OPERATION_ADMIN_USER) {
        const response = await axiosWithAuth.get(
          `/api/admin/get-user-normal-for-authorize?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
        );
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      } else {
        return {
          data: [],
          pagination: null,
        };
      }
    } catch {
      return {
        data: [],
        pagination: null,
      };
    }
  };

  static getUserRequestOperation = async ({
    pageSize = 15,
    currentPage = 1,
    search = "",
  }: getUserParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/admin/get-all-user-authorize?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch {
      return {
        data: [],
        pagination: null,
      };
    }
  };

  static approveRequestUser = async ({ id }: getUserByIdParams) => {
    try {
      await axiosWithAuth.get(`/api/admin/approve-user/${id}`);
      return {
        success: true,
        message: "The user has been approved successfully!",
      };
    } catch {
      return {
        success: false,
        message: "Failed to approve user. Please try again.",
      };
    }
  };
}

export default UserManagementService;
