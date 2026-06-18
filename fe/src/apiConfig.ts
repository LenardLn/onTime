import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
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
