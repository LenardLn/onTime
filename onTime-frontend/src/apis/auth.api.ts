import { request } from "@/apiConfig";
import type { Credentials } from "@/entities/credentials";

export const register = async (credentials: Credentials) => {
  return await request<Credentials>("post", "/register", credentials);
};
