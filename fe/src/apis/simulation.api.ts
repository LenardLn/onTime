import { request } from "@/apiConfig";
import type { ClosestBusResponse, LiveBus } from "@/entities/liveBus";

const simulationApi = {
  START: "/simulation/start",
  STOP: "/simulation/stop",
  LIVE: "/simulation/live",
  CLOSEST_BUS: "/simulation/closest-bus",
} as const;

export const startSimulation = async () => {
  return await request("post", simulationApi.START, undefined, true);
};

export const stopSimulation = async () => {
  return await request("post", simulationApi.STOP, undefined, true);
};

export const getLiveBuses = async (
  lineId: number,
  maxAgeSeconds?: number,
): Promise<LiveBus[]> => {
  return await request<LiveBus[]>("get", simulationApi.LIVE, undefined, true, {
    line_id: lineId,
    ...(maxAgeSeconds && { max_age_seconds: maxAgeSeconds }),
  });
};

export const getClosestBus = async (
  lineId: number,
  stationId: number,
  maxAgeSeconds?: number,
): Promise<ClosestBusResponse> => {
  return await request<ClosestBusResponse>(
    "get",
    simulationApi.CLOSEST_BUS,
    undefined,
    true,
    {
      line_id: lineId,
      station_id: stationId,
      ...(maxAgeSeconds && { max_age_seconds: maxAgeSeconds }),
    },
  );
};
