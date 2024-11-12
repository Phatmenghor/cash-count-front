import {
  axiosUploadFile,
  axiosViewPDF,
  axiosWithAuth,
} from "@/utils/api/axios";
import { AddRecordParamModel } from "../models/cashManagement/AddRecordParamModel";
import { UpdateRecordModel } from "../models/cashManagement/UpdateRecordParam";

interface geCashListParams {
  pageSize?: number;
  currentPage?: number;
  srNumber?: string;
  status?: string;
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
    status = "",
  }: geCashListParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/cash-counts?pageSize=${pageSize}&currentPage=${currentPage}&srNumber=${srNumber}&status=${status}`
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
    } catch {
      return {
        success: false,
      };
    }
  };

  static updateFileRecord = async (data: SubmissionData) => {
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      const response = await axiosUploadFile.put(`/api/files`, formData);
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

  static createCashRecord = async (data: AddRecordParamModel) => {
    try {
      await axiosWithAuth.post(`/api/cash-counts`, data);
      return {
        success: true,
        message: "Cash record created successfully!",
      };
    } catch {
      return {
        success: false,
        message: "Failed to create cash record. Please try again.",
      };
    }
  };

  static updateCashRecord = async (id: number, data: UpdateRecordModel) => {
    try {
      await axiosWithAuth.put(`/api/cash-counts/${id}`, data);
      return {
        success: true,
        message: "Cash record updated successfully!",
      };
    } catch {
      return {
        success: false,
        message: "Failed to update cash record. Please try again.",
      };
    }
  };

  static getCashRecordById = async (data: getCashRecordParam) => {
    try {
      const response = await axiosWithAuth.get(`/api/cash-counts/${data.id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch {
      return {
        success: false,
        data: null,
      };
    }
  };

  static getCashInSystemById = async (data: getCashRecordParam) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/cash-in-system/${data.id}`
      );
      return response.data.data;
    } catch {
      return null;
    }
  };

  static getViewPDFById = async (data: getCashRecordParam) => {
    try {
      const response = await axiosViewPDF.get(`/api/files/view/${data.id}`);

      const url = URL.createObjectURL(response.data);
      return url;
    } catch {
      return null;
    }
  };
}
