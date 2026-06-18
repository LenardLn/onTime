export const UserRoles = {
  ADMIN: "Admin",
  DRIVER: "Driver",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export type Profile = {
  email: string;
  id: string;
  roles?: UserRole;
};

export type CreatedBy = Profile;

export type AdminUser = {
  id: number;
  email: string;
  roles: UserRole;
  created_at?: string | null;
};

export type UpdateUserPayload = {
  email?: string;
  role?: UserRole;
  password?: string;
};

export type UpdateEmailPayload = {
  email: string;
  password: string;
};

export type UpdatePasswordPayload = {
  current_password: string;
  new_password: string;
};
