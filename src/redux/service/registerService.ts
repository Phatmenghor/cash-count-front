import { axiosNoAuth } from "@/utils/api/axios";
import { RoleModel } from "../models/register/RoleModel";
import { PositionModel } from "../models/register/PositionModel";
import { DepartmentModel } from "../models/register/DepartmentModel";
import { BranchModel } from "../models/register/BranchModel";
import axios from "axios";

interface submidEmailModel {
  mail: string;
}

interface verifyEmailModel {
  mail: string;
  code: string;
}

interface registerAccount {
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  email: string;
  roleId: number;
  branchId: number;
  departmentId: number;
  positionId: number;
  otpCode: string;
}

export class RegisterService {
  static getRole = async () => {
    try {
      const response = await axiosNoAuth.get("/api/role/get-roles");
      if (response.status === 200) {
        return response.data.data as RoleModel[]; // Return an array of RoleModel
      }
      return null;
    } catch {
      return null;
    }
  };

  static getBranch = async () => {
    try {
      const response = await axiosNoAuth.get("/api/branch/get-branches");
      if (response.status === 200) {
        return response.data.data as BranchModel[]; // Return an array of BranchModel
      }
      return null;
    } catch {
      return null;
    }
  };

  static getPosition = async () => {
    try {
      const response = await axiosNoAuth.get("/api/position/get-positions");
      if (response.status === 200) {
        return response.data.data as PositionModel[]; // Return an array of PositionModel
      }
      return null;
    } catch {
      return null;
    }
  };

  static getDepartment = async () => {
    try {
      const response = await axiosNoAuth.get(
        "/api/department/get-all-department"
      );
      if (response.status === 200) {
        return response.data.data as DepartmentModel[]; // Return an array of DepartmentModel
      }
      return null;
    } catch {
      return null;
    }
  };

  static fetchAllData() {
    return Promise.all([
      this.getRole(),
      this.getBranch(),
      this.getPosition(),
      this.getDepartment(),
    ]).then(([roles, branches, positions, departments]) => ({
      roles,
      branches,
      positions,
      departments,
    }));
  }

  static submidEmail = async (payload: submidEmailModel) => {
    try {
      await axiosNoAuth.post("/auth/send-mail-otp-user", payload);
      return true;
    } catch {
      return false;
    }
  };

  static verifyEmail = async (payload: verifyEmailModel) => {
    try {
      await axiosNoAuth.post("/auth/verify-otp-user", payload);
      return true;
    } catch {
      return false;
    }
  };

  static registerAccount = async (payload: registerAccount) => {
    try {
      await axiosNoAuth.post("/auth/register-user", payload);
      return { success: true, message: "Registration successful!" };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 403) {
          return {
            success: false,
            message:
              "This email is already registered. Please try a different one.",
          };
        }
        return {
          success: false,
          message: "Registration failed. Please try again.",
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred. Please check your connection.",
      };
    }
  };
}
