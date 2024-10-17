import keyEnv from "@/constants/env";
import { StatusEnum } from "@/models/cashRecord/StatusEnum";
import { axiosNoAuth, axiosWithAuth } from "@/utils/api/axios";
import TokenUtils from "@/utils/localStorage/token";
import axios from "axios";

interface FetchRecordsParams {
  currentPage?: number;
  pageSize?: number;
  status?: StatusEnum | null;
  srNumber?: string;
}

export class CashRecordService {
  static fetchCash = async ({
    currentPage = 1,
    pageSize = 10,
    status = null, // Default to null
    srNumber = "",
  }: FetchRecordsParams) => {
    try {
      //   let url = `${keyEnv.BASE_URL}/api/cash-counts?currentPage=${currentPage}&pageSize=${pageSize}`;
      //   console.log("### ===response");
      //   if (srNumber) {
      //     url += `&srNumber=${srNumber}`;
      //   }
      //   if (status) {
      //     url += `&status=${status}`;
      //   }

      //   console.log("### ===response", url);

      const response = await axios.get(
        `${keyEnv.BASE_URL}/api/admin/get-all-users`,
        {
          headers: {
            Authorization: `Bearer ${TokenUtils.getToken()}`, // Include token in the header
          },
        }
      );
      // const response = await axiosWithAuth.get("/api/admin/get-all-users");

      console.log("### ===response", response);

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("H## HEUnexpected error:", error);
        // Log the error status, message, and data if available
        console.error("##Error fetching cash records:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      } else {
        // Log general errors that are not Axios related
        console.error("Unexpected error:", error);
      }

      throw new Error("Failed to fetch cash records.");
    }
  };
}
