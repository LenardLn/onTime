import {useCallback, useEffect, useRef, useState} from 'react';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {postLocation} from '../api/locations';
import {distanceMeters} from '../utils/distance';

const MOVE_THRESHOLD_M = 10;
const SEND_INTERVAL_MS = 5000;

export type AccuracyMode = 'high' | 'balanced' | 'low';

/**
 * Each mode maps to a set of Geolocation options. "high" uses GPS satellites
 * (most accurate but can fail indoors / with weak signal); "balanced" and "low"
 * fall back to Wi-Fi / cell-tower based location, which is less precise but works
 * when GPS can't get a fix.
 */
const MODE_OPTIONS: Record<AccuracyMode, any> = {
  high: {
    enableHighAccuracy: true,
    distanceFilter: 5,
    interval: 3000,
    fastestInterval: 2000,
    timeout: 20000,
    maximumAge: 0,
  },
  balanced: {
    enableHighAccuracy: false,
    distanceFilter: 10,
    interval: 5000,
    fastestInterval: 3000,
    timeout: 20000,
    maximumAge: 5000,
  },
  low: {
    enableHighAccuracy: false,
    distanceFilter: 20,
    interval: 8000,
    fastestInterval: 5000,
    timeout: 30000,
    maximumAge: 15000,
  },
};

// What to drop to when a mode can't get a fix.
const FALLBACK_NEXT: Record<AccuracyMode, AccuracyMode | null> = {
  high: 'balanced',
  balanced: 'low',
  low: null,
};

type TrackerParams = {
  busId: number;
  enabled: boolean;
  /** The accuracy the user picked; the tracker may auto-fall-back from here. */
  accuracyMode?: AccuracyMode;
  onError?: (message: string) => void;
  onSent?: () => void;
  /** Reports the accuracy actually in use (changes if it auto-falls-back). */
  onActiveModeChange?: (mode: AccuracyMode) => void;
};

/**
 * Watches the device location and posts an update whenever the bus moves at
 * least 10 meters OR at least every 5 seconds. If the chosen accuracy can't get
 * a fix (e.g. GPS sees satellites but never locks), it automatically falls back
 * to a less precise mode that works off Wi-Fi / cell towers.
 */
export const useLocationTracker = ({
  busId,
  enabled,
  accuracyMode = 'high',
  onError,
  onSent,
  onActiveModeChange,
}: TrackerParams) => {
  const latestRef = useRef<GeolocationResponse | null>(null);
  const lastSentRef = useRef<{lat: number; lon: number} | null>(null);
  const lastSentAtRef = useRef<number>(0);

  // The accuracy actually being used right now (may differ after a fallback).
  const [activeMode, setActiveMode] = useState<AccuracyMode>(accuracyMode);

  // Reset to the user's choice whenever they change it or re-enable tracking.
  useEffect(() => {
    setActiveMode(accuracyMode);
  }, [accuracyMode, enabled]);

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

    onActiveModeChange?.(activeMode);

    const options = MODE_OPTIONS[activeMode];
    let gotFix = false;

    const onPosition = (position: GeolocationResponse) => {
      gotFix = true;
      latestRef.current = position;
      evaluateAndSend(position);
    };

    const handleError = (error: {message: string}) => {
      const next = FALLBACK_NEXT[activeMode];
      // If we never got a fix in this mode, drop to a less precise one.
      if (!gotFix && next) {
        setActiveMode(next);
        return;
      }
      onError?.(error.message);
    };

    const watchId = Geolocation.watchPosition(onPosition, handleError, options);

    Geolocation.getCurrentPosition(onPosition, handleError, {
      enableHighAccuracy: options.enableHighAccuracy,
      timeout: options.timeout,
      maximumAge: options.maximumAge,
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
  }, [enabled, activeMode, evaluateAndSend, onError, onActiveModeChange]);
};
