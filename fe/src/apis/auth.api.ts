import { request } from "@/apiConfig";
import type { Profile } from "@/components/contexts/authContext";
import type { Credentials } from "@/entities/credentials";

export const register = async (credentials: Credentials) => {
  return await request<Credentials>("post", "/register", credentials);
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
