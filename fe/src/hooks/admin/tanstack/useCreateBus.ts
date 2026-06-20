import { createBus } from "@/apis/buses.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { Bus, CreateBusPayload } from "@/entities/bus";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateBus = () => {
  const queryClient = useQueryClient();
  return useMutation<Bus, Error, CreateBusPayload>({
    mutationFn: (payload) => createBus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.BUSES, genericQueryKeys.LIST],
      });
    },
  });
};

export default useCreateBus;
