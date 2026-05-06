import { Marker, type MarkerEvent } from "@vis.gl/react-maplibre";
import MarkerInfoCard from "../marker-info-card/MarkerInfoCard";
import type { BaseCoordinates } from "@/helpers/baseCoordinates";
import { MapView, type MapViewMode } from "../map/MapComponent";

export type MapMarker = {
  latitude: number;
  longitude: number;
};

interface MarkersProps {
  markers: BaseCoordinates[];
  handleMarkers: (e: MarkerEvent<MouseEvent>, marker: BaseCoordinates) => void;
  selectedMarkers: BaseCoordinates[];
  onDragEnd: (
    oldMarker: BaseCoordinates,
    newCoords: { lat: number; lng: number },
  ) => void;
  mode: MapViewMode;
}

const Markers = ({
  markers,
  handleMarkers,
  selectedMarkers,
  onDragEnd,
  mode,
}: MarkersProps) => {
  if (mode !== MapView.EDIT) return null;

  return (
    <div>
      {markers.map((marker) => (
        <Marker
          key={`${marker.order_index}`}
          latitude={marker.latitude}
          longitude={marker.longitude}
          color="red"
          draggable={mode === MapView.EDIT}
          onClick={(e) => handleMarkers(e, marker)}
          onDragEnd={(e) => {
            const { lat, lng } = e.lngLat;
            onDragEnd(marker, { lat, lng });
          }}
        >
          {selectedMarkers.includes(marker) && <MarkerInfoCard />}
        </Marker>
      ))}
    </div>
  );
};

export default Markers;
