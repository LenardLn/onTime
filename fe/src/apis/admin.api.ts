import { request } from "@/apiConfig";
import type { RouteFilters } from "@/entities/route";
import { buildQueryParams } from "@/helpers/buildQueryParams";

const adminApi = {
  LINE: "/line",
  GET_LINE_DETAILS: (id: string) => `/line/${id}`,
  GET_STATION_DETAILS: (id: string) => `/station/${id}`,
  ROUTE: "/route",
} as const;

const urls = {
  getLines: adminApi.LINE,
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
    adminApi.ROUTE,
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

export const createLine = async (line_name: string) => {
  return await request("post", adminApi.LINE, { name: line_name }, true);
};

export const createRoute = async (routeData: any) => {
  return await request("post", adminApi.ROUTE, routeData, true);
};
