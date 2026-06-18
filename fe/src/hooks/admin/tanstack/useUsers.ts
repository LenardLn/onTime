import { getUsers } from "@/apis/users.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import type { AdminUser } from "@/entities/user";
import { useQuery } from "@tanstack/react-query";

const useUsers = () => {
  return useQuery<AdminUser[], Error>({
    queryKey: [queryKeys.USERS, genericQueryKeys.LIST],
    queryFn: () => getUsers(),
  });
};

export default useUsers;
