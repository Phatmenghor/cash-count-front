import { axiosWithAuth } from "@/utils/api/axios";
import axios from "axios";

interface getBranchParams {
  pageSize?: number;
  currentPage?: number;
  search?: string;
}

interface createBranchParams {
  branchCode: string;
  mnemonic: string;
  city: string;
}

interface updateBranchParams {
  branchCode: string;
  mnemonic: string;
  city: string;
}

export class BranchService {
  static getBranch = async ({
    pageSize = 15,
    currentPage = 1,
    search = "",
  }: getBranchParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/branch?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch {
      return { data: [], pagination: null };
    }
  };

  static createBranch = async (payload: createBranchParams) => {
    try {
      const response = await axiosWithAuth.post(`/api/branch/store`, payload);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 403) {
          return {
            success: false,
            data:
              "This Branch code is already created. Please try a different one.",
          };
        }
        return {
          success: false,
          data: "Failed to create branch. Please try again.",
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred. Please check your connection.",
      };
    }
  };

  static updateBranch = async (payload: updateBranchParams) => {
    try {
      const response = await axiosWithAuth.post(`/api/branch/update`, payload);
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
}
