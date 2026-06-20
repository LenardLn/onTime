import { getBuses } from "@/apis/buses.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { Bus } from "@/entities/bus";
import { useQuery } from "@tanstack/react-query";

const useBuses = () => {
  return useQuery<Bus[], Error>({
    queryKey: [queryKeys.BUSES, genericQueryKeys.LIST],
    queryFn: () => getBuses(),
  });
};

export default useBuses;
