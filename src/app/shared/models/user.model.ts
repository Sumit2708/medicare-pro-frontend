import { UserRole } from "../../core/enums/user-role.enum";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  token: string;
}