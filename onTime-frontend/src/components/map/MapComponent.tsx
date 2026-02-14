import { Map, Marker, NavigationControl } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Theme } from "../../entities/theme";

interface MapComponentProps {
  theme: Theme;
}

const MapComponent = ({ theme }: MapComponentProps) => {
  const bounds: [[number, number], [number, number]] = [
    [23.439274, 47.617155], // SW [lng, lat]
    [23.729459, 47.686301], // NE [lng, lat]
  ];
  return (
    <div className="w-screen h-screen rounded-xl">
      <Map
        // mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" // colorful light
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
      >
        <NavigationControl position="top-right" />
        <Marker
          longitude={47.662278}
          latitude={23.579052}
          color="red"
          className="z-10"
        />
      </Map>
    </div>
  );
};

export default MapComponent;
