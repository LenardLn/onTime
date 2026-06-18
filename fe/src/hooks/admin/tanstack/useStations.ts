import { getStations } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { StationsResponse } from "@/entities/route";
import { useQuery } from "@tanstack/react-query";

const useStations = () => {
  return useQuery<StationsResponse, Error>({
    queryKey: [queryKeys.STATIONS, genericQueryKeys.LIST],
    queryFn: () => getStations(),
  });
};

export default useStations;
