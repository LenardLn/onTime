import { getRouteDetails } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { Route, RouteFilters } from "@/entities/route";
import { queryTime } from "@/helpers/queryTime";
import { useQuery } from "@tanstack/react-query";

const useRoute = (filters: RouteFilters) => {
  return useQuery<Route, Error>({
    queryKey: [queryKeys.ROUTES, genericQueryKeys.ITEM, filters],
    queryFn: () => getRouteDetails(filters),
    staleTime: queryTime("1h"),
    enabled: Boolean(filters?.line_ids?.[0] || filters?.station_ids?.[0]),
  });
};

export default useRoute;
