import { axiosWithAuth } from "@/utils/api/axios";
import axios from "axios";

interface getBranchParams {
  pageSize?: number;
  currentPage?: number;
  search?: string;
}

interface createDepartmentParams {
  code: string;
  name: string;
}

interface updateDepartmentParams {
  id: string;
  code: string;
  name: string;
}

export class DepartmentService {
  static getDepartment = async ({
    pageSize = 15,
    currentPage = 1,
    search = "",
  }: getBranchParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/department?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch {
      return { data: [], pagination: null };
    }
  };

  static createDepartment = async (payload: createDepartmentParams) => {
    try {
      console.log("### ===payload", payload);
      const response = await axiosWithAuth.post(
        `/api/department/store`,
        payload
      );
      console.log("### ===", response);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 403) {
          return {
            success: false,
            data: "This Department name is already created. Please try a different one.",
          };
        }
        return {
          success: false,
          data: "Failed to create department. Please try again.",
        };
      }
      return {
        success: false,
        data: "An unexpected error occurred. Please check your connection.",
      };
    }
  };

  static updateDepartment = async (payload: updateDepartmentParams) => {
    try {
      const response = await axiosWithAuth.post(
        `/api/department/update`,
        payload
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
}
