import { request } from "@/apiConfig";
import type { Bus, CreateBusPayload, UpdateBusPayload } from "@/entities/bus";

const busesApi = {
  BUSES: "/buses",
  BUS_ID: (id: number) => `/buses/${id}`,
} as const;

export const getBuses = async () => {
  return await request<Bus[]>("get", busesApi.BUSES, undefined, true);
};

export const createBus = async (payload: CreateBusPayload) => {
  return await request<Bus>("post", busesApi.BUSES, payload, true);
};

export const updateBus = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateBusPayload;
}) => {
  return await request<Bus>("put", busesApi.BUS_ID(id), payload, true);
};

export const deleteBus = async (id: number) => {
  return await request("delete", busesApi.BUS_ID(id), undefined, true);
};
