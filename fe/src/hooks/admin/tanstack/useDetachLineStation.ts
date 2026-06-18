import { detachLineStation } from "@/apis/lineStation.api";
import { queryKeys } from "@/entities/enums/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDetachLineStation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (id) => detachLineStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.LINE_STATIONS],
      });
    },
  });
};

export default useDetachLineStation;
