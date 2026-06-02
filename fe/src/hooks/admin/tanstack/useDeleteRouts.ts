import { deleteRoute } from "@/apis/admin.api";
import { genericQueryKeys, queryKeys } from "@/entities/enums/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteRoute = () => {
    const queryClient = useQueryClient();

    return useMutation<string, Error, string>({
        mutationFn: (id: string) => deleteRoute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.LINES, genericQueryKeys.LIST],
            });
        },
    });
};

export default useDeleteRoute;