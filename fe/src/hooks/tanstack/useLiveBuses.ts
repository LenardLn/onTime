import { getLiveBuses } from "@/apis/simulation.api";
import type { LiveBus } from "@/entities/liveBus";
import { useQuery } from "@tanstack/react-query";

/**
 * Polls the latest position of every bus on the given line every 5 seconds.
 * Disabled until a line is selected.
 */
const useLiveBuses = (lineId?: number) => {
  return useQuery<LiveBus[], Error>({
    queryKey: ["liveBuses", lineId],
    queryFn: () => getLiveBuses(lineId!),
    enabled: Boolean(lineId),
    refetchInterval: 5000,
    // Pull the latest position immediately when returning to the tab so the bus
    // snaps to where it is now instead of flying across the map.
    refetchOnWindowFocus: true,
  });
};

export default useLiveBuses;
