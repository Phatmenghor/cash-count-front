import { axiosWithAuth } from "@/utils/api/axios";

interface getAllReportModel {
  fromDate: string;
  toDate: string;
  status?: string;
}

export class ReportService {
  static getAllReport = async ({
    fromDate = "",
    toDate = "",
    status = "",
  }: getAllReportModel) => {
    try {
      const response = await axiosWithAuth.get(
        `/api/report/preview?fromDate=${fromDate}&toDate=${toDate}&status=${status}`
      );
      return response.data.data;
    } catch {
      return [];
    }
  };

  static getDownloadReport = async ({
    fromDate = "",
    toDate = "",
    status = "",
  }: getAllReportModel) => {
    try {
      const response = await axiosWithAuth.get("/api/report/generate-excel", {
        params: {
          fromDate: fromDate,
          toDate: toDate,
          status: status,
        },
        responseType: "arraybuffer",
      });

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      return file;
    } catch (error) {
      console.error("Error generating Excel report:", error);
      throw new Error("Failed to download the report. Please try again.");
    }
  };
}
