export interface LoginUserModel {
  id: number | null;
  name: string | null;
  userToken: string;
  dateExpired: Date | null;
  roleName: string;
}
