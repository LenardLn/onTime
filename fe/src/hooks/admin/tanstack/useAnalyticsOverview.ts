import { getAnalyticsOverview } from "@/apis/analytics.api";
import type { AnalyticsOverview } from "@/entities/analytics";
import { queryKeys } from "@/entities/enums/queryKeys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useAnalyticsOverview = () => {
  return useQuery<AnalyticsOverview, Error>({
    queryKey: [queryKeys.ANALYTICS, "overview"],
    queryFn: () => getAnalyticsOverview(),
    // Refresh when the admin returns to the tab. staleTime stays 0 so the focus
    // refetch actually fires; the backend caches the heavy computation (~10 min)
    // so repeat fetches are cheap.
    refetchOnWindowFocus: true,
    // Keep the previous data on screen while a refetch runs (and hold it in
    // cache for 30 min) so re-opening the dashboard shows charts instantly and
    // refreshes in the background instead of flashing the full-page loader.
    placeholderData: keepPreviousData,
    gcTime: 30 * 60 * 1000,
  });
};

export default useAnalyticsOverview;
