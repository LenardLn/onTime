import { createRoute } from "@/apis/admin.api";
import type { CreateRoutePayload } from "@/entities/route";
import { useMutation } from "@tanstack/react-query";

const useCreateRoute = () => {
  return useMutation<CreateRoutePayload, Error, any>({
    mutationFn: (routeData: CreateRoutePayload) => createRoute(routeData),
  });
};

export default useCreateRoute;
