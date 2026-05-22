import {useCallback, useEffect, useRef} from 'react';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {buildTopic, postLocation} from '../api/locations';
import {distanceMeters} from '../utils/distance';

const MOVE_THRESHOLD_M = 10;
const WATCH_OPTIONS = {
  enableHighAccuracy: true,
  distanceFilter: 5,
  interval: 3000,
  fastestInterval: 2000,
};

type TrackerParams = {
  driverName: string;
  busName: string;
  enabled: boolean;
  onError?: (message: string) => void;
  onSent?: () => void;
};

export function useLocationTracker({
  driverName,
  busName,
  enabled,
  onError,
  onSent,
}: TrackerParams) {
  const lastSentRef = useRef<{lat: number; lon: number} | null>(null);
  const topicRef = useRef<string>(buildTopic(driverName, busName));

  useEffect(() => {
    topicRef.current = buildTopic(driverName, busName);
  }, [driverName, busName]);

  const sendPosition = useCallback(
    async (position: GeolocationResponse) => {
      const {latitude, longitude, speed} = position.coords;
      const lat = latitude;
      const lon = longitude;
      const last = lastSentRef.current;

      if (last) {
        const moved = distanceMeters(last.lat, last.lon, lat, lon);
        if (moved < MOVE_THRESHOLD_M) {
          return;
        }
      }

      try {
        await postLocation({
          lat,
          lon,
          tst: Math.floor(position.timestamp / 1000),
          vel: speed != null && speed >= 0 ? speed : 0,
          topic: topicRef.current,
        });
        lastSentRef.current = {lat, lon};
        onSent?.();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to send location';
        onError?.(message);
      }
    },
    [onError, onSent],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const watchId = Geolocation.watchPosition(
      sendPosition,
      error => onError?.(error.message),
      WATCH_OPTIONS,
    );

    Geolocation.getCurrentPosition(
      sendPosition,
      error => onError?.(error.message),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
    );

    return () => Geolocation.clearWatch(watchId);
  }, [enabled, sendPosition, onError]);
}
