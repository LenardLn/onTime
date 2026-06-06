import type { LiveBus } from "@/entities/liveBus";
import AnimatedBusMarker from "./AnimatedBusMarker";

type LiveBusesProps = {
  buses?: LiveBus[];
  onBusClick?: (bus: LiveBus) => void;
};

const LiveBuses = ({ buses, onBusClick }: LiveBusesProps) => {
  if (!buses?.length) return null;

  return (
    <>
      {buses.map((bus) => (
        // Stable key per bus so the marker instance (and its animation state)
        // is preserved across polls and glides from old -> new position.
        <AnimatedBusMarker key={bus.bus_id} bus={bus} onClick={onBusClick} />
      ))}
    </>
  );
};

export default LiveBuses;
