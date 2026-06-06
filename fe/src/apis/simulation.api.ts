import { request } from "@/apiConfig";
import type { LiveBus } from "@/entities/liveBus";

const simulationApi = {
  START: "/simulation/start",
  STOP: "/simulation/stop",
  LIVE: "/simulation/live",
} as const;

export const startSimulation = async () => {
  return await request("post", simulationApi.START, undefined, true);
};

export const stopSimulation = async () => {
  return await request("post", simulationApi.STOP, undefined, true);
};

export const getLiveBuses = async (lineId: number): Promise<LiveBus[]> => {
  return await request<LiveBus[]>("get", simulationApi.LIVE, undefined, true, {
    line_id: lineId,
  });
};
