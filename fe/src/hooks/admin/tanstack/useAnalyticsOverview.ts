import { getAnalyticsOverview } from "@/apis/analytics.api";
import type { AnalyticsOverview } from "@/entities/analytics";
import { queryKeys } from "@/entities/enums/queryKeys";
import { useQuery } from "@tanstack/react-query";

const useAnalyticsOverview = () => {
  return useQuery<AnalyticsOverview, Error>({
    queryKey: [queryKeys.ANALYTICS, "overview"],
    queryFn: () => getAnalyticsOverview(),
    // Refresh when the admin returns to the tab. staleTime stays 0 so the focus
    // refetch actually fires; the backend caches the heavy computation (~10 min)
    // so repeat fetches are cheap.
    refetchOnWindowFocus: true,
  });
};

export default useAnalyticsOverview;
