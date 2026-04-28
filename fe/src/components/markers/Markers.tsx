import { Marker, type MarkerEvent } from "@vis.gl/react-maplibre";
import MarkerInfoCard from "../marker-info-card/MarkerInfoCard";

export type MapMarker = {
  latitude: number;
  longitude: number;
};

interface MarkersProps {
  markers: MapMarker[];
  handleMarkers: (e: MarkerEvent<MouseEvent>, marker: MapMarker) => void;
  selectedMarkers: MapMarker[];
  onDragEnd: (
    oldMarker: MapMarker,
    newCoords: { lat: number; lng: number },
  ) => void;
}

const Markers = ({
  markers,
  handleMarkers,
  selectedMarkers,
  onDragEnd,
}: MarkersProps) => {
  return (
    <div>
      {markers.map((marker) => (
        <Marker
          key={`${marker.latitude}-${marker.longitude}`}
          longitude={marker.longitude}
          latitude={marker.latitude}
          color="red"
          draggable
          onClick={(e) => {
            handleMarkers(e, marker);
          }}
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
