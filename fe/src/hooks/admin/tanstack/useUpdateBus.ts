import { updateBus } from "@/apis/buses.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { Bus, UpdateBusPayload } from "@/entities/bus";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateBus = () => {
  const queryClient = useQueryClient();
  return useMutation<Bus, Error, { id: number; payload: UpdateBusPayload }>({
    mutationFn: ({ id, payload }) => updateBus({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.BUSES, genericQueryKeys.LIST],
      });
    },
  });
};

export default useUpdateBus;
