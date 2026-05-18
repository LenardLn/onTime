import Map, { NavigationControl } from "@vis.gl/react-maplibre";
import { type ReactNode } from "react";
import { useThemeContext } from "../contexts/ThemeContextProvider";
import { useMapEditorContext } from "../contexts/mapEditorContext";

interface BaseMapProps {
  children: ReactNode;
  handleAddMarker?: (e: maplibregl.MapMouseEvent) => void;
}

const BaseMap = ({ children, handleAddMarker }: BaseMapProps) => {
  const { theme } = useThemeContext();
  const { isLocked } = useMapEditorContext();

  const bounds: [[number, number], [number, number]] = [
    [23.439274, 47.617155], // SW [lng, lat]
    [23.729459, 47.686301], // NE [lng, lat]
  ];

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
      onClick={isLocked ? undefined : handleAddMarker}
      dragPan={!isLocked}
      scrollZoom={!isLocked}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-right" />
      {children}
    </Map>
  );
};

export default BaseMap;
