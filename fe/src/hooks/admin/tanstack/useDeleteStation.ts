import { deleteStation } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteStation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string | number>({
    mutationFn: (id: string | number) => deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.STATIONS, genericQueryKeys.LIST],
      });
    },
  });
};

export default useDeleteStation;
