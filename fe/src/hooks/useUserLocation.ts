import { useEffect, useRef, useState } from "react";

export type UserLocation = { lat: number; lon: number };

/**
 * Tracks the browser's geolocation (like the Google Maps "my location" dot).
 * Tracking is off until `enable()` / `toggle()` is called, then it follows the
 * user live via watchPosition.
 */
const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setError(null);
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 },
    );

    return () => {
      if (watchId.current != null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [enabled]);

  return {
    location,
    enabled,
    error,
    enable: () => setEnabled(true),
    toggle: () => setEnabled((prev) => !prev),
  };
};

export default useUserLocation;
