import { getClosestBus } from "@/apis/simulation.api";
import type { ClosestBusResponse } from "@/entities/liveBus";
import { useQuery } from "@tanstack/react-query";

const LIVE_MAX_AGE_SECONDS = 120;

/**
 * Polls the closest bus *approaching* the given station along the route
 * (direction-aware, derived from the bus's last GPS samples). With
 * `onlyFresh`, buses silent for over two minutes are ignored.
 */
const useClosestBus = (
  lineId?: number,
  stationId?: number,
  onlyFresh = false,
  enabled = true,
) => {
  return useQuery<ClosestBusResponse, Error>({
    queryKey: ["closestBus", lineId, stationId, onlyFresh],
    queryFn: () =>
      getClosestBus(
        lineId!,
        stationId!,
        onlyFresh ? LIVE_MAX_AGE_SECONDS : undefined,
      ),
    enabled: Boolean(lineId && stationId) && enabled,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
};

export default useClosestBus;
