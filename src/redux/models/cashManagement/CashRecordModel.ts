import { PaginationModel } from "../global/PaginationModel";

export interface CashRecordListModel {
  data: CashRecordModel[];
  pagination: PaginationModel | null;
}

export interface CashRecordModel {
  id: number;
  srNumber: string;
  branch: Branch;
  status: string;
  createdBy: CreatedBy;
  checkerBy: CheckerBy;
  approvedBy: ApprovedBy;
  createdDate: string;
  updatedDate: string;
}

interface Branch {
  id: number;
  branchCode: string;
  mnemonic: string;
  city: string;
  userType: any;
}

interface CreatedBy {
  id: number;
  name: string;
  roleId: number;
  branchId: number;
}

interface CheckerBy {
  id: number;
  name: string;
  roleId: number;
  branchId: number;
}

interface ApprovedBy {
  id: number;
  name: string;
  roleId: number;
  branchId: number;
}
