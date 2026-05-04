import type { BaseCoordinates } from "@/helpers/baseCoordinates";
import type { CreatedBy } from "./user";

export type Route = {
  routes: BaseCoordinates[];
  created_at: string;
  created_by: CreatedBy;
};

export type RouteFilters = {
  line_ids?: (number | string)[];
  station_ids?: (number | string)[];
};
