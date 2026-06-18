
import { getRouteDetails } from "@/apis/admin.api";
import type { RouteData, RouteFilters } from "@/entities/route";
import { useQuery } from "@tanstack/react-query";


export type RoutesResponse = {
  line_ids: number[]
  response: RouteData[]
}

const useRoute = (filters: RouteFilters) => {
  return useQuery<RoutesResponse, Error>({
    queryKey: [filters],
    queryFn: () => getRouteDetails(filters),
    enabled: Boolean(filters?.line_ids?.[0]),
  });
};

export default useRoute;
