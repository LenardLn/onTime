import {
  Map,
  Marker,
  NavigationControl,
  Source,
  Layer,
  type MapLayerMouseEvent,
} from "@vis.gl/react-maplibre";
import type { FeatureCollection, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Theme } from "../../entities/theme";
import { useState } from "react";

interface MapComponentProps {
  theme: Theme;
}

type MapMarker = {
  latitude: number;
  longitude: number;
};

const MapComponent = ({ theme }: MapComponentProps) => {
  const bounds: [[number, number], [number, number]] = [
    [23.439274, 47.617155], // SW [lng, lat]
    [23.729459, 47.686301], // NE [lng, lat]
  ];

  const [markers, setMarkers] = useState<MapMarker[]>([]);

  const addMarker = (e: MapLayerMouseEvent) => {
    const { lat, lng } = e.lngLat;
    const newMarker: MapMarker = { latitude: lat, longitude: lng };
    setMarkers((prev) => [...prev, newMarker]);
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

        {markers.map((marker) => (
          <Marker
            key={marker.latitude}
            longitude={marker.longitude}
            latitude={marker.latitude}
            color="red"
            className="z-10"
            onClick={(e) => console.log(e)}
          />
        ))}

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
