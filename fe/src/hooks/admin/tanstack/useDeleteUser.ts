import { deleteUser } from "@/apis/users.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS, genericQueryKeys.LIST],
      });
    },
  });
};

export default useDeleteUser;
