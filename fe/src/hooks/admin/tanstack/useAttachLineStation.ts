import { attachLineStation } from "@/apis/lineStation.api";
import { queryKeys } from "@/entities/enums/queryKeys";
import type { CreateLineStationPayload } from "@/entities/lineStation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAttachLineStation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, CreateLineStationPayload>({
    mutationFn: (payload) => attachLineStation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.LINE_STATIONS],
      });
    },
  });
};

export default useAttachLineStation;
