import { request } from "@/apiConfig";
import type { Credentials } from "@/entities/credentials";
import type {
  Profile,
  UpdateEmailPayload,
  UpdatePasswordPayload,
} from "@/entities/user";

export const register = async (credentials: Credentials) => {
  return await request<Credentials>("post", "/register", credentials, true);
};

export const login = async (credentials: Credentials) => {
  return await request<Credentials>("post", "/login", credentials, true);
};

export const me = async () => {
  return await request<Profile>("get", "/me", undefined, true);
};

export const logout = async () => {
  return await request("post", "/logout", undefined, true);
};

export const updateEmail = async (payload: UpdateEmailPayload) => {
  return await request<Profile>("put", "/me/email", payload, true);
};

export const updatePassword = async (payload: UpdatePasswordPayload) => {
  return await request("put", "/me/password", payload, true);
};
