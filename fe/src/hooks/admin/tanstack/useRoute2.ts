import { getRouteDetails2 } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { RouteData, RouteFilters } from "@/entities/route";
import { queryTime } from "@/helpers/queryTime";
import { useQuery } from "@tanstack/react-query";


export type RoutesResponse = {
  line_ids: number[]
  response: RouteData[]
}

const useRoute2 = (filters: RouteFilters) => {
  return useQuery<RoutesResponse, Error>({
    queryKey: [filters],
    queryFn: () => getRouteDetails2(filters),
    enabled: Boolean(filters?.line_ids?.[0]),
  });
};

export default useRoute2;
