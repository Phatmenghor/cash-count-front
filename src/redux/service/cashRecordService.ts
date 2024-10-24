import keyEnv from "@/constants/env";
import { StatusEnum } from "@/redux/models/cashRecord/StatusEnum";
import { axiosNoAuth, axiosWithAuth } from "@/utils/api/axios";
import TokenStorage from "@/utils/localStorage/tokenStorage";
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
    status = null,
    srNumber = "",
  }: FetchRecordsParams) => {
    try {
      let url = `/api/cash-counts?currentPage=${currentPage}&pageSize=${pageSize}`;

      if (srNumber) {
        url += `&srNumber=${srNumber}`;
      }
      if (status) {
        url += `&status=${status}`;
      }
      const response = await axiosWithAuth.get(url);
      return response.data;
    } catch (error) {
      console.log("## ===", error);
      return false;
    }
  };
}
