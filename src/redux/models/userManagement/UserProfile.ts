export interface UserProfile {
  branchId: number;
  role: Role[];
  name: string;
  branchMnemonic: string;
  id: number;
  userType: string;
  position: Position;
  department: Department;
  email: string;
  username: string;
}

interface Role {
  id: number;
  name: string;
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
