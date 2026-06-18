import type { LiveBus } from "@/entities/liveBus";
import AnimatedBusMarker from "./AnimatedBusMarker";

type LiveBusesProps = {
  buses?: LiveBus[];
  onBusClick?: (bus: LiveBus) => void;
  highlightBusId?: number;
};

const LiveBuses = ({ buses, onBusClick, highlightBusId }: LiveBusesProps) => {
  if (!buses?.length) return null;

  return (
    <>
      {buses.map((bus) => (
        // Stable key per bus so the marker instance (and its animation state)
        // is preserved across polls and glides from old -> new position.
        <AnimatedBusMarker
          key={bus.bus_id}
          bus={bus}
          onClick={onBusClick}
          highlighted={bus.bus_id === highlightBusId}
        />
      ))}
    </>
  );
};

export default LiveBuses;
