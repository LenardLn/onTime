import axios from "axios";

export type LatLng = { lat: number; lon: number };

export type WalkingRoute = {
  /** Path as [lng, lat] pairs (GeoJSON order), ready for a MapLibre LineString. */
  coordinates: [number, number][];
  /** Estimated walking time in seconds (null if unavailable). */
  durationSec: number | null;
  /** Walking distance in metres (null if unavailable). */
  distanceM: number | null;
};

/**
 * Walking route between two points via Geoapify, including the estimated time
 * and distance so the UI can show "how long to walk to the station".
 */
export const getWalkingRoute = async (
  from: LatLng,
  to: LatLng,
): Promise<WalkingRoute> => {
  const key = import.meta.env.VITE_GEOAPIFY_KEY;
  const waypoints = `${from.lat},${from.lon}|${to.lat},${to.lon}`;

  const response = await axios.get(
    `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=walk&apiKey=${key}`,
  );

  const feature = response.data.features?.[0];
  const geometry = feature?.geometry;
  if (!geometry) return { coordinates: [], durationSec: null, distanceM: null };

  // Geoapify returns LineString or MultiLineString; normalise to [lng,lat][].
  const coordinates: [number, number][] =
    geometry.type === "MultiLineString"
      ? geometry.coordinates.flat()
      : geometry.coordinates;

  return {
    coordinates,
    durationSec: feature?.properties?.time ?? null,
    distanceM: feature?.properties?.distance ?? null,
  };
};
