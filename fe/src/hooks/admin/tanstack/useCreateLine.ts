import { createLine } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateLine = () => {
  const queryClient = useQueryClient()
  return useMutation<string, Error, string>({
    mutationFn: (name: string) => createLine(name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.LINES, genericQueryKeys.LIST],
      });
    }
  });
};

export default useCreateLine;
