import {useCallback, useEffect, useRef} from 'react';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {postLocation} from '../api/locations';
import {distanceMeters} from '../utils/distance';

const MOVE_THRESHOLD_M = 10;
const SEND_INTERVAL_MS = 5000;
const WATCH_OPTIONS = {
  enableHighAccuracy: true,
  distanceFilter: 5,
  interval: 3000,
  fastestInterval: 2000,
};

type TrackerParams = {
  busId: number;
  enabled: boolean;
  onError?: (message: string) => void;
  onSent?: () => void;
};

/**
 * Watches the device GPS and posts a location update whenever the bus moves at
 * least 10 meters OR at least every 5 seconds, whichever comes first.
 */
export const useLocationTracker = ({
  busId,
  enabled,
  onError,
  onSent,
}: TrackerParams) => {
  const latestRef = useRef<GeolocationResponse | null>(null);
  const lastSentRef = useRef<{lat: number; lon: number} | null>(null);
  const lastSentAtRef = useRef<number>(0);

  const evaluateAndSend = useCallback(
    async (position: GeolocationResponse) => {
      const {latitude, longitude, speed} = position.coords;
      const now = Date.now();
      const last = lastSentRef.current;
      const elapsed = now - lastSentAtRef.current;
      const moved = last
        ? distanceMeters(last.lat, last.lon, latitude, longitude)
        : Infinity;

      if (last && moved < MOVE_THRESHOLD_M && elapsed < SEND_INTERVAL_MS) {
        return;
      }

      try {
        await postLocation({
          bus_id: busId,
          lat: latitude,
          lon: longitude,
          vel: speed != null && speed >= 0 ? speed : 0,
          tst: Math.floor(position.timestamp / 1000),
        });
        lastSentRef.current = {lat: latitude, lon: longitude};
        lastSentAtRef.current = now;
        onSent?.();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to send location';
        onError?.(message);
      }
    },
    [busId, onError, onSent],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onPosition = (position: GeolocationResponse) => {
      latestRef.current = position;
      evaluateAndSend(position);
    };

    const watchId = Geolocation.watchPosition(
      onPosition,
      error => onError?.(error.message),
      WATCH_OPTIONS,
    );

    Geolocation.getCurrentPosition(onPosition, error => onError?.(error.message), {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });

    const intervalId = setInterval(() => {
      if (latestRef.current) {
        evaluateAndSend(latestRef.current);
      }
    }, SEND_INTERVAL_MS);

    return () => {
      Geolocation.clearWatch(watchId);
      clearInterval(intervalId);
    };
  }, [enabled, evaluateAndSend, onError]);
}
