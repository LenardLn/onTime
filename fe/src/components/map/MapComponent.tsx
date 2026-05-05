import {
  Map,
  NavigationControl,
  Source,
  Layer,
  type MapLayerMouseEvent,
  type MarkerEvent,
  Marker,
} from "@vis.gl/react-maplibre";
import type { FeatureCollection, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import Markers from "../markers/Markers";
import { useThemeContext } from "../contexts/ThemeContextProvider";
import type { BaseCoordinates } from "@/helpers/baseCoordinates";

export const MapView = {
  VIEW: "view",
  EDIT: "edit",
} as const;

export type MapViewMode = (typeof MapView)[keyof typeof MapView];

interface MapComponentProps {
  markerList?: BaseCoordinates[];
  mode: MapViewMode;
}

const MapComponent = ({ markerList, mode }: MapComponentProps) => {
  const bounds: [[number, number], [number, number]] = [
    [23.439274, 47.617155], // SW [lng, lat]
    [23.729459, 47.686301], // NE [lng, lat]
  ];

  const [selectedMarker, setSelectedMarker] = useState<BaseCoordinates[]>([]);
  const { theme } = useThemeContext();

  const [markers, setMarkers] = useState<BaseCoordinates[]>(markerList || []);

  const addMarker = (e: MapLayerMouseEvent) => {
    if (mode !== "edit") return;

    const { lat, lng } = e.lngLat;

    const newMarker: BaseCoordinates = {
      latitude: lat,
      longitude: lng,
      order_index: markers.length,
    };

    setMarkers((prev) => [...prev, newMarker]);
  };

  const handleMarkerDragEnd = (
    oldMarker: BaseCoordinates,
    newCoords: { lat: number; lng: number },
  ) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.latitude === oldMarker.latitude && m.longitude === oldMarker.longitude
          ? {
            latitude: newCoords.lat,
            longitude: newCoords.lng,
            order_index: m.order_index,
          }
          : m,
      ),
    );
  };

  const handleOpenedMarkers = (
    e: MarkerEvent<MouseEvent>,
    marker: BaseCoordinates,
  ) => {
    e.originalEvent.stopPropagation();
    setSelectedMarker((prev) => {
      const exists = prev.some(
        (m) =>
          m.latitude === marker.latitude && m.longitude === marker.longitude,
      );
      if (exists) {
        return prev.filter(
          (m) =>
            m.latitude !== marker.latitude || m.longitude !== marker.longitude,
        );
      }
      return [...prev, marker];
    });
  };

  const routeGeoJSON: FeatureCollection<LineString> = {
    type: "FeatureCollection",
    features:
      markers.length > 1
        ? [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: markers.map((m) => [m.longitude, m.latitude]),
            },
            properties: {},
          },
        ]
        : [],
  };

  return (
    <Map
      mapStyle={
        theme === "light"
          ? "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          : "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      }
      initialViewState={{
        latitude: 47.657,
        longitude: 23.578,
        zoom: 12,
      }}
      minZoom={12}
      maxZoom={18}
      maxBounds={bounds}
      onClick={addMarker}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-right" />
      <Markers
        markers={markers}
        handleMarkers={handleOpenedMarkers}
        selectedMarkers={selectedMarker}
        onDragEnd={handleMarkerDragEnd}
        mode={mode}
      />
      <Marker
        latitude={47.65804539306299}
        longitude={23.503012814572486}
        color="red"
      >
        <div>test123</div>
      </Marker>
      {markers.length > 1 && (
        <Source id="route" type="geojson" data={routeGeoJSON}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color": "#007bff",
              "line-width": 4,
            }}
          />
        </Source>
      )}
    </Map>
  );
};

export default MapComponent;
