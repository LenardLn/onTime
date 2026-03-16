import axios, { type AxiosRequestConfig } from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: URL,
});

export const request = async <T = any>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const controller = new AbortController();

  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data,
      signal: controller.signal,
      ...config,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  } finally {
    controller.abort();
  }
};
