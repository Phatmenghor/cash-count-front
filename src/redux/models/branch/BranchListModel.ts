import { PaginationModel } from "../global/PaginationModel";

export interface BranchListModel {
  data: Daum[];
  pagination: PaginationModel | null;
}

interface Daum {
  id: number;
  userId: number;
  branchCode: string;
  mnemonic: string;
  city: string;
}
