import { PaginationModel } from "../global/PaginationModel";

export interface userRequestListModel {
  data: UserRequestModel[];
  pagination: PaginationModel | null;
}

export interface UserRequestModel {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: Role;
  branch: Branch;
  department: Department;
  position: Position;
  otpCode: string;
  status: number;
  requestType?: string | null;
}

interface Role {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  userId: number;
  branchCode: string;
  mnemonic: string;
  city: string;
}

interface Department {
  id: number;
  code: string;
  name: string;
}

export interface Position {
  id: number;
  name: string;
}
