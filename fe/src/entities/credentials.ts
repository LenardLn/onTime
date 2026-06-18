import type { UserRole } from "./user";

export type Credentials = {
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
  id?: string;
};
