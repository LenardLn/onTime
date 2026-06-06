import axios from "axios";

export type LatLng = { lat: number; lon: number };

/**
 * Walking route between two points via Geoapify. Returns the path as an array
 * of [lng, lat] pairs (GeoJSON order), ready to feed a MapLibre LineString.
 */
export const getWalkingRoute = async (
  from: LatLng,
  to: LatLng,
): Promise<[number, number][]> => {
  const key = import.meta.env.VITE_GEOAPIFY_KEY;
  const waypoints = `${from.lat},${from.lon}|${to.lat},${to.lon}`;

  const response = await axios.get(
    `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=walk&apiKey=${key}`,
  );

  const geometry = response.data.features?.[0]?.geometry;
  if (!geometry) return [];

  // Geoapify returns LineString or MultiLineString; normalise to [lng,lat][].
  return geometry.type === "MultiLineString"
    ? (geometry.coordinates.flat() as [number, number][])
    : (geometry.coordinates as [number, number][]);
};
