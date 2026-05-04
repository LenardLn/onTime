import { getLines } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { Line } from "@/entities/line";
import { queryTime } from "@/helpers/queryTime";
import { useQuery } from "@tanstack/react-query";

const useLines = () => {
  return useQuery<Line[], Error>({
    queryKey: [queryKeys.rou, genericQueryKeys.LIST],
    queryFn: () => getLines(),
    staleTime: queryTime("1h"),
  });
};

export default useLines;
