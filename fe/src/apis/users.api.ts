import { request } from "@/apiConfig";
import type { AdminUser, UpdateUserPayload } from "@/entities/user";

const usersApi = {
  USERS: "/users",
  USER_ID: (id: number) => `/users/${id}`,
} as const;

export const getUsers = async () => {
  return await request<AdminUser[]>("get", usersApi.USERS, undefined, true);
};

export const updateUser = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateUserPayload;
}) => {
  return await request<AdminUser>("put", usersApi.USER_ID(id), payload, true);
};

export const deleteUser = async (id: number) => {
  return await request("delete", usersApi.USER_ID(id), undefined, true);
};
