import { deleteBus } from "@/apis/buses.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteBus = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (id: number) => deleteBus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.BUSES, genericQueryKeys.LIST],
      });
    },
  });
};

export default useDeleteBus;
