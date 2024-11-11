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
  position: Position;
  userType: string;
  email: string;
  status: number;
  roles: Role[];
}

interface Position {
  id: number;
  name: string;
  fullName: string;
}

interface Role {
  id: number;
  name: string;
}
