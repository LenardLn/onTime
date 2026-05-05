import { request } from "@/apiConfig";
import type { RouteFilters } from "@/entities/route";
import { buildQueryParams } from "@/helpers/buildQueryParams";

const adminApi = {
  GET_LINES: "/line",
  GET_LINE_DETAILS: (id: string) => `/line/${id}`,
  GET_STATION_DETAILS: (id: string) => `/station/${id}`,
  GET_ROUTE: "/route",
} as const;

const urls = {
  getLines: adminApi.GET_LINES,
};

export const getLines = async () => {
  return await request("get", urls.getLines, undefined, true);
};

export const getLineDetails = async (id: string) => {
  return await request("get", adminApi.GET_LINE_DETAILS(id), undefined, true);
};

export const getRouteDetails = async (filters: RouteFilters) => {
  return await request(
    "get",
    adminApi.GET_ROUTE,
    undefined,
    true,
    buildQueryParams(filters),
  );
};

export const getRouteDetails2 = async (filters: RouteFilters) => {
  return await request(
    "get",
    "/route/test",
    undefined,
    true,
    buildQueryParams(filters),
  );
};

export const getStationDetails = async (id: string) => {
  return await request(
    "get",
    adminApi.GET_STATION_DETAILS(id),
    undefined,
    true,
  );
};
