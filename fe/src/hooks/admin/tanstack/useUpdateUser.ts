import { updateUser } from "@/apis/users.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { AdminUser, UpdateUserPayload } from "@/entities/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<AdminUser, Error, { id: number; payload: UpdateUserPayload }>({
    mutationFn: ({ id, payload }) => updateUser({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS, genericQueryKeys.LIST],
      });
    },
  });
};

export default useUpdateUser;
