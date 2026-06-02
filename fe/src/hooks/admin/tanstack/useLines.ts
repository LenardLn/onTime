import { getLines } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { Line } from "@/entities/line";
import { useQuery } from "@tanstack/react-query";

const useLines = () => {
  return useQuery<Line[], Error>({
    queryKey: [queryKeys.LINES, genericQueryKeys.LIST],
    queryFn: () => getLines(),
  });
};

export default useLines;
