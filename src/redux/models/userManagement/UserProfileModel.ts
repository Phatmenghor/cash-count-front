export interface UserProfile {
  roleId: number;
  name: string;
  roleName: string;
  id: number;
  position: Position;
  department: Department;
  branch: Branch;
  email: string;
  username: string;
}

interface Position {
  id: number;
  name: string;
}

interface Department {
  id: number;
  code: string;
  name: string;
}

interface Branch {
  id: number;
  branchCode: string;
  mnemonic: string;
  city: string;
  userType: string;
}
