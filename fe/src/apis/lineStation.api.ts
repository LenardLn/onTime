import { request } from "@/apiConfig";
import type {
  CreateLineStationPayload,
  LineStationList,
} from "@/entities/lineStation";

const lineStationApi = {
  BASE: "/line-stations",
  BY_ID: (id: number) => `/line-stations/${id}`,
} as const;

export const getLineStations = async (params?: {
  station_id?: number;
  line_id?: number;
}) =>
  request<LineStationList>(
    "get",
    lineStationApi.BASE,
    undefined,
    true,
    params,
  );

export const attachLineStation = async (payload: CreateLineStationPayload) =>
  request("post", lineStationApi.BASE, payload, true);

export const detachLineStation = async (id: number) =>
  request("delete", lineStationApi.BY_ID(id), undefined, true);
