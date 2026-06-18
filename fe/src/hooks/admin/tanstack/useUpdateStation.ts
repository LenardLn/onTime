import { updateStation } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { CreateStationPayload, StationsResponse } from "@/entities/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateStation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    StationsResponse,
    Error,
    { id: string | number; payload: Partial<CreateStationPayload> }
  >({
    mutationFn: ({ id, payload }) => updateStation({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.STATIONS, genericQueryKeys.LIST],
      });
    },
  });
};

export default useUpdateStation;
