import { createStation } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { CreateStationPayload, StationsResponse } from "@/entities/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateStation = () => {
  const queryClient = useQueryClient();
  return useMutation<StationsResponse, Error, CreateStationPayload>({
    mutationFn: (payload: CreateStationPayload) => createStation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.STATIONS, genericQueryKeys.LIST],
      });
    },
  });
};

export default useCreateStation;
