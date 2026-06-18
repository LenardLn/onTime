import { getLineStations } from "@/apis/lineStation.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { LineStationList } from "@/entities/lineStation";
import { useQuery } from "@tanstack/react-query";

const useLineStations = () => {
  return useQuery<LineStationList, Error>({
    queryKey: [queryKeys.LINE_STATIONS, genericQueryKeys.LIST],
    queryFn: () => getLineStations(),
  });
};

export default useLineStations;
