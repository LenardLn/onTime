import { createRoute } from "@/apis/admin.api";
import { appPaths } from "@/entities/enums/appPaths";
import type { CreateRoutePayload } from "@/entities/route";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const useCreateRoute = () => {
  const navigate = useNavigate();
  return useMutation<{ line_id: number }, Error, any>({
    mutationFn: ({ lineId, routeData }: { lineId: string, routeData: CreateRoutePayload }) => createRoute({ lineId, routeData }),
    onSuccess: (data) => {
      navigate(appPaths.adminRouteDetails(data.line_id.toString()));
    }
  });
};

export default useCreateRoute;
