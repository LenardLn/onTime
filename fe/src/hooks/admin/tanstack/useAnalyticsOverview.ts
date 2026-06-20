import { getAnalyticsOverview } from "@/apis/analytics.api";
import type { AnalyticsOverview } from "@/entities/analytics";
import { queryKeys } from "@/entities/enums/queryKeys";
import { useQuery } from "@tanstack/react-query";

const useAnalyticsOverview = () => {
  return useQuery<AnalyticsOverview, Error>({
    queryKey: [queryKeys.ANALYTICS, "overview"],
    queryFn: () => getAnalyticsOverview(),
    staleTime: 5 * 60 * 1000,
  });
};

export default useAnalyticsOverview;
