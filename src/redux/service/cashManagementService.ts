import { axiosUploadFile, axiosWithAuth } from "@/utils/api/axios";
import axios from "axios";
import { AddRecordParamModel } from "../models/cashManagement/AddRecordParamModel";

interface geCashListParams {
  pageSize?: number;
  currentPage?: number;
  srNumber?: string;
}

export interface SubmissionData {
  file: File; // For the PDF file
}

interface getCashRecordParam {
  id: number; // For the PDF file
}

export class CashManagementService {
  static getCashRecordList = async ({
    pageSize = 15,
    currentPage = 1,
    srNumber = "",
  }: geCashListParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/cash-counts?pageSize=${pageSize}&currentPage=${currentPage}&srNumber=${srNumber}`
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch {
      return { data: [], pagination: null };
    }
  };

  static getVerifyRecord = async () => {
    try {
      const response = await axiosWithAuth.post(`/api/cash-in-system`);
      return response.data.data;
    } catch {
      return null;
    }
  };

  static uploadFileRecord = async (data: SubmissionData) => {
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      const response = await axiosUploadFile.post(`/api/files`, formData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  };

  static createCashRecord = async (data: AddRecordParamModel) => {
    try {
      await axiosWithAuth.post(`/api/cash-counts`, data);
      return {
        success: true,
        message: "Cash record created successfully!",
      };
    } catch (error) {
      console.log("### ===", error);
      return {
        success: false,
        message: "Failed to create cash record. Please try again.",
      };
    }
  };

  static getCashRecordById = async (data: getCashRecordParam) => {
    try {
      const response = await axiosWithAuth.get(`/api/cash-counts/${data.id}`);
      return response.data.data;
    } catch {
      return null;
    }
  };
}
