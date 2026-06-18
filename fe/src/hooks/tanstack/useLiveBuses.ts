import { getLiveBuses } from "@/apis/simulation.api";
import type { LiveBus } from "@/entities/liveBus";
import { useQuery } from "@tanstack/react-query";

// Buses whose latest GPS update is older than this are hidden in live mode.
const LIVE_MAX_AGE_SECONDS = 120;

/**
 * Polls the latest position of every bus on the given line every 5 seconds.
 * Disabled until a line is selected. With `onlyFresh`, buses silent for over
 * two minutes are filtered out (used for real driver GPS data).
 */
const useLiveBuses = (lineId?: number, onlyFresh = false) => {
  return useQuery<LiveBus[], Error>({
    queryKey: ["liveBuses", lineId, onlyFresh],
    queryFn: () =>
      getLiveBuses(lineId!, onlyFresh ? LIVE_MAX_AGE_SECONDS : undefined),
    enabled: Boolean(lineId),
    refetchInterval: 5000,
    // Pull the latest position immediately when returning to the tab so the bus
    // snaps to where it is now instead of flying across the map.
    refetchOnWindowFocus: true,
  });
};

export default useLiveBuses;
