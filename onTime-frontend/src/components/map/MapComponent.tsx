import {
  Map,
  NavigationControl,
  Source,
  Layer,
  type MapLayerMouseEvent,
  type MarkerEvent,
} from "@vis.gl/react-maplibre";
import type { FeatureCollection, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Theme } from "../../entities/theme";
import { useState } from "react";
import type { MapMarker } from "../markers/Markers";
import Markers from "../markers/Markers";

interface MapComponentProps {
  theme: Theme;
}

const MapComponent = ({ theme }: MapComponentProps) => {
  const bounds: [[number, number], [number, number]] = [
    [23.439274, 47.617155], // SW [lng, lat]
    [23.729459, 47.686301], // NE [lng, lat]
  ];

  const [selectedMarker, setSelectedMarker] = useState<MapMarker[]>([]);

  const [markers, setMarkers] = useState<MapMarker[]>([]);

  const addMarker = (e: MapLayerMouseEvent) => {
    const { lat, lng } = e.lngLat;
    const newMarker: MapMarker = { latitude: lat, longitude: lng };
    setMarkers((prev) => [...prev, newMarker]);
  };

  const handleMarkerDragEnd = (
    oldMarker: MapMarker,
    newCoords: { lat: number; lng: number },
  ) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.latitude === oldMarker.latitude && m.longitude === oldMarker.longitude
          ? { latitude: newCoords.lat, longitude: newCoords.lng }
          : m,
      ),
    );
  };

  const handleOpenedMarkers = (
    e: MarkerEvent<MouseEvent>,
    marker: MapMarker,
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
    <div className="w-screen h-screen rounded-xl">
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
      >
        <NavigationControl position="top-right" />
        <Markers
          markers={markers}
          handleMarkers={handleOpenedMarkers}
          selectedMarkers={selectedMarker}
          onDragEnd={handleMarkerDragEnd}
        />
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
    </div>
  );
};

export default MapComponent;
