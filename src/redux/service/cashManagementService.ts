import { axiosWithAuth } from "@/utils/api/axios";

interface geCashListParams {
  pageSize?: number;
  currentPage?: number;
}

export class CashManagementService {
  static getCashRecordList = async ({
    pageSize = 15,
    currentPage = 1,
  }: geCashListParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/cash-counts?pageSize=${pageSize}&currentPage=${currentPage}`
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch {
      return { data: [], pagination: null };
    }
  };
}
