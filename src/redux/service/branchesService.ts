import { axiosWithAuth } from "@/utils/api/axios";
import { error } from "console";

export class BranchesService {
  static getBranches = async () => {
    try {
      const response = await axiosWithAuth.post(`/api/branch`, {
        draw: 1,
        start: 0,
        length: 10,
        search: {
          value: "",
          regex: false,
        },
        order: [
          {
            column: 0, // Adjust this based on the column index you want to sort by
            dir: "asc", // or 'desc' for descending order
            // dir: "desc",
          },
        ],
        columns: [
          { data: "id" },
          { data: "branch_code" },
          { data: "city" },
          { data: "mnemonic" },
        ],
      });
      if (response.status === 200) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.log("## ===", error);
      return null;
    }
  };
}
