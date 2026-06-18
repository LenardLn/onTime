import axios from "axios";

// In dev, API calls go through Vite's proxy (see vite.config.ts) under "/api"
// so the browser always talks to the same origin it was loaded from. That lets
// the app run over a phone tunnel / LAN against the deployed backend without
// tripping its CORS allowlist. Production builds hit VITE_BACKEND_URL directly.
const baseURL = import.meta.env.DEV ? "/api" : import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL,
});

export const request = async <T = any>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  withCredentials?: boolean,
  params?: any,
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data,
      withCredentials,
      params,
    });

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message;

    throw new Error(message);
  }
};
