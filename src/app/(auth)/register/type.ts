import { BranchModel } from "@/redux/models/register/BranchModel";
import { PositionModel } from "@/redux/models/register/PositionModel";
import { RoleModel } from "@/redux/models/register/RoleModel";

export interface AllDataType {
  roles: RoleModel[] | null;
  branches: BranchModel[] | null;
  positions: PositionModel[] | null;
}

export interface FormDataType {
  email: string;
  otp: string;
  usernameAD: string;
  firstName: string;
  lastName: string;
  password: string;
  position: PositionModel | null;
  role: RoleModel | null;
  branch: BranchModel | null;
}
