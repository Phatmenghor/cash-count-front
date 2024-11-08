import { axiosWithAuth } from "@/utils/api/axios";
import axios from "axios";

interface getPositionParams {
  pageSize?: number;
  currentPage?: number;
  search?: string;
}

interface createPositionParams {
  name: string;
}

interface updatePositionParams {
  id: number;
  name: string;
}

export class PositionService {
  static getPosition = async ({
    pageSize = 15,
    currentPage = 1,
    search = "",
  }: getPositionParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/position?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch {
      return { data: [], pagination: null };
    }
  };

  static createPosition = async (payload: createPositionParams) => {
    try {
      const response = await axiosWithAuth.post(`/api/position/store`, payload);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 403) {
          return {
            success: false,
            data: "This Positon is already created. Please try a different one.",
          };
        }
        return {
          success: false,
          data: "Failed to create position. Please try again.",
        };
      }
      return {
        success: false,
        data: "An unexpected error occurred. Please check your connection.",
      };
    }
  };

  static updatePosition = async (payload: updatePositionParams) => {
    try {
      const response = await axiosWithAuth.post(
        `/api/position/update`,
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
