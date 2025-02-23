import { axiosWithAuth } from "@/utils/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfile } from "../models/userManagement/UserProfileModel";
import { UserRoleEnum } from "@/constants/userRole";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import UserTypeStorage from "@/utils/localStorage/userTypeStorage";

interface getUserParams {
  pageSize?: number;
  currentPage?: number;
  search?: string;
  status?: number | null;
}

interface updateStatusParams {
  id: number;
  status: number;
}

interface getUserByIdParams {
  id: number;
}

export interface updateUserInfo {
  name: string;
  roleId: number;
  branchId: number;
  positionId: number;
}

interface getUserByInputterParams {
  type: UserRoleEnum;
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

  static getUserByTokenStore = async () => {
    try {
      const response = await axiosWithAuth.get(`/auth/get-user-info-by-token`);
      if (response.status == 200) {
        const data: UserProfile = response.data.data;
        UserTypeStorage.setUserType(data.branch.userType);
      }
      return response.data.data;
    } catch {
      return null;
    }
  };

  static getAllUsers = async ({
    pageSize = 15,
    currentPage = 1,
    search = "",
  }: getUserParams) => {
    try {
      const userRole = UserRoleStorage.getUserRole();
      if (userRole == UserRoleEnum.IT_ADMIN_USER) {
        const response = await axiosWithAuth.get(
          `/api/admin/get-user-all?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
        );
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      } else if (userRole == UserRoleEnum.OPERATION_ADMIN_USER) {
        const response = await axiosWithAuth.get(
          `/api/admin/get-user-normal?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
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
      return { data: [], pagination: null };
    }
  };

  static getAllByBodyUsers = async ({
    pageSize = 15,
    currentPage = 1,
    search = "",
    status = 1,
  }: getUserParams) => {
    try {
      const userRole = UserRoleStorage.getUserRole();
      if (userRole == UserRoleEnum.IT_ADMIN_USER) {
        const response = await axiosWithAuth.post(
          `/api/admin/get-user-all?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
          { status }
        );
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      } else if (userRole == UserRoleEnum.OPERATION_ADMIN_USER) {
        const response = await axiosWithAuth.post(
          `/api/admin/get-user-normal?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
          { status }
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

  static getUserRequestByID = async ({ id }: getUserByIdParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/admin/get-user-authorize-info/${id}`
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch {
      return {
        success: false,
      };
    }
  };

  static updateUserById = async (id: number, profileData: updateUserInfo) => {
    try {
      await axiosWithAuth.post(`/auth/update-user-info/${id}`, profileData);
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
      if (userRole == UserRoleEnum.IT_ADMIN_USER) {
        const response = await axiosWithAuth.get(
          `/api/admin/get-all-user-authorize?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
        );
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      } else if (userRole == UserRoleEnum.OPERATION_ADMIN_USER) {
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

  static rejectRequestUser = async ({ id }: getUserByIdParams) => {
    try {
      await axiosWithAuth.get(`/api/admin/reject-user/${id}`);
      return {
        success: true,
        message: "The user has been rejected successfully!",
      };
    } catch {
      return {
        success: false,
        message: "Failed to rejected user. Please try again.",
      };
    }
  };

  static getUserListByInputter = async (data: getUserByInputterParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/admin/get-user-by-inputter?type=${data.type}`
      );
      return response.data.data;
    } catch {
      return null;
    }
  };

  static fetchAllUser() {
    return Promise.all([
      this.getUserListByInputter({ type: UserRoleEnum.AUTHORIZER_USER }),
      this.getUserListByInputter({ type: UserRoleEnum.CHECKER_USER }),
    ]).then(([approve, checker]) => ({
      approve,
      checker,
    }));
  }
}

export default UserManagementService;
