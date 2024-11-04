import { PaginationModel } from "../global/PaginationModel";

export interface userManagementListModel {
  data: userManagementModel[];
  pagination: PaginationModel | null;
}

export interface userManagementModel {
  id: number;
  name: string;
  username: string;
  branchMnemonic: string;
  department: Department;
  position: Position;
  userType: string;
  email: string;
  status: number;
  roles: Role[];
}

interface Department {
  id: number;
  code: string;
  name: string;
}

interface Position {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}
