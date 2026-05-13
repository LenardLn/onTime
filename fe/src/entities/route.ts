import type { BaseCoordinates } from "@/helpers/baseCoordinates";
import type { CreatedBy } from "./user";

export type Station = {
  id: string;
  name: string;
  lat: number;
  long: number;
  order_index: number;
};

export type Route = {
  id: string;
  lat: number;
  long: number;
  order_index: number;
};

export type RouteData = {
  id: string;
  name: string;
  routes: Route[];
  stations: Station[];
};

export type RouteFilters = {
  line_ids?: (number | string)[];
  station_ids?: (number | string)[];
};

export type CreateRoutePayload = {
  routes: Route[];
  waypoints: Route[];
  // "created_at": "string",
  // "created_by": {
  //   "id": 0,
  //   "email": "string"
  // }
};
