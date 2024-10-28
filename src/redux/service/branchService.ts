import { axiosWithAuth } from "@/utils/api/axios";

interface getBranchParams {
  pageSize?: string; // Optional parameter
  currentPage?: number; // Optional parameter
}

export class BranchService {
  static getBranch = async ({
    pageSize = "15",
    currentPage = 1,
  }: getBranchParams) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/branch?pageSize=${pageSize}&currentPage=${currentPage}`
      );
      if (response.status === 200) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
        };
      }
      return { data: [], pagination: null };
    } catch {
      return { data: [], pagination: null };
    }
  };
}
