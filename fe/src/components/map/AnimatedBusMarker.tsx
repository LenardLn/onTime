import { useEffect, useRef, useState } from "react";
import { Marker } from "@vis.gl/react-maplibre";
import type { LiveBus } from "@/entities/liveBus";
import movingBusIcon from "@/assets/moving_bus.svg";

// Glide duration between two polled positions (matches the 5s refetch).
const ANIM_MS = 5000;
// If the next position is farther than this, jump instead of gliding. Avoids the
// "fly across the map" when returning from a background tab (rAF/polling paused)
// or when a bus restarts its route from the beginning.
const SNAP_THRESHOLD_M = 200;

type LatLon = { lat: number; lon: number };

const metersBetween = (a: LatLon, b: LatLon) => {
  const dLat = (b.lat - a.lat) * 111320;
  const dLon = (b.lon - a.lon) * 111320 * Math.cos((a.lat * Math.PI) / 180);
  return Math.hypot(dLat, dLon);
};

type Props = {
  bus: LiveBus;
  onClick?: (bus: LiveBus) => void;
  highlighted?: boolean;
};

/**
 * Bus marker that smoothly interpolates from its previous position to the latest
 * polled position, but snaps instantly when the jump is too large.
 */
const AnimatedBusMarker = ({ bus, onClick, highlighted = false }: Props) => {
  const posRef = useRef<LatLon>({ lat: bus.lat, lon: bus.lon });
  const [pos, setPos] = useState(posRef.current);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = posRef.current;
    const to = { lat: bus.lat, lon: bus.lon };
    if (from.lat === to.lat && from.lon === to.lon) return;

    // Large jump (returned from background, route restart) -> snap, no glide.
    if (metersBetween(from, to) > SNAP_THRESHOLD_M) {
      posRef.current = to;
      setPos(to);
      return;
    }

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / ANIM_MS, 1);
      const next = {
        lat: from.lat + (to.lat - from.lat) * t,
        lon: from.lon + (to.lon - from.lon) * t,
      };
      posRef.current = next;
      setPos(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [bus.lat, bus.lon]);

  return (
    <Marker
      latitude={pos.lat}
      longitude={pos.lon}
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick?.(bus);
      }}
    >
      <div className="relative flex items-center justify-center">
        {highlighted && (
          <>
            <span className="absolute size-12 animate-ping rounded-full bg-green-500/40" />
            <span className="absolute size-11 rounded-full border-2 border-green-500" />
          </>
        )}
        <img
          src={movingBusIcon}
          alt={bus.bus_name}
          className="relative size-8 shrink-0 cursor-pointer"
        />
      </div>
    </Marker>
  );
};

export default AnimatedBusMarker;
