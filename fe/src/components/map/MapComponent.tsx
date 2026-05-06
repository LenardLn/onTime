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
import { useEffect, useState } from "react";
import Markers from "../markers/Markers";
import { useThemeContext } from "../contexts/ThemeContextProvider";
import type { BaseCoordinates } from "@/helpers/baseCoordinates";
import type { RouteData } from "@/entities/route";

export const MapView = {
  VIEW: "view",
  EDIT: "edit",
} as const;

export type MapViewMode = (typeof MapView)[keyof typeof MapView];

interface MapComponentProps {
  markerList?: BaseCoordinates[]
  routeData?: RouteData[];
  mode: MapViewMode;
}

const MapComponent = ({ markerList, mode, routeData }: MapComponentProps) => {
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
      {routeData?.map((route) =>
        route.stations.map((station) => (
          <Marker
            key={`${route.id}-${station.id}`}
            latitude={Number(station.lat)}
            longitude={Number(station.long)}
            color="red"
          >
            <div>{station.name}</div>
          </Marker>
        ))
      )}
      <Marker
        latitude={47.65804539306299}
        longitude={23.503012814572486}
        color="red"
      >
        <div>test123</div>
      </Marker>
      {routeData?.map((item, index: number) => {
        const geojson: FeatureCollection<LineString> = {
          type: "FeatureCollection",
          features:
            item.routes?.length > 1
              ? [
                {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: item.routes.map((m) => [
                      Number(m.long),
                      Number(m.lat),
                    ]),
                  },
                  properties: {},
                },
              ]
              : [],
        };

        const sourceId = `route-${item.id}`;
        const layerId = `route-line-${item.id}`;

        return (
          <Source key={sourceId} id={sourceId} type="geojson" data={geojson}>
            <Layer
              id={layerId}
              type="line"
              paint={{
                "line-color": index % 2 ? "red" : "green",
                "line-width": 4,
              }}
            />
          </Source>
        );
      })}
    </Map>
  );
};

export default MapComponent;
