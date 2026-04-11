import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

export const request = async <T = any>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  withCredentials?: boolean,
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data,
      withCredentials,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
