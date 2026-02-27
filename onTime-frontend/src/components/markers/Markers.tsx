
import {

    Marker,
    type MarkerEvent,

} from "@vis.gl/react-maplibre";
import MarkerInfoCard from "../markerInfoCard/MarkerInfoCard";

export type MapMarker = {
    latitude: number;
    longitude: number;
};

interface MarkersProps {
    markers: MapMarker[];
    handleMarkers: (e: MarkerEvent<MouseEvent>, marker: MapMarker) => void,
    selectedMarkers: MapMarker[]
}

function Markers({ markers, handleMarkers, selectedMarkers }: MarkersProps) {
    return (
        <div>
            {markers.map((marker) => (
                <Marker
                    key={`${marker.latitude}-${marker.longitude}`}
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    color="red"
                    onClick={(e) => {
                        handleMarkers(e, marker)
                    }}
                >
                    {selectedMarkers.includes(marker) && (
                        <MarkerInfoCard />
                    )}
                </Marker>
            ))}
        </div>
    )
}

export default Markers