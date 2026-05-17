import type { Station } from "@/entities/route";
import { Marker } from "@vis.gl/react-maplibre";
import BusIcon from "@/assets/bus_station.svg";
type LatLng = {
  lat: number;
  lng: number;
};

type BusStationProps = {
  station: Station;
  onDragEnd?: (station: Station, { lat, lng }: LatLng) => void;
  draggable?: boolean;
};

function BusStation({
  station,
  onDragEnd,
  draggable = false,
}: BusStationProps) {
  return (
    <>
      <Marker
        latitude={station.lat}
        longitude={station.long}
        color="red"
        draggable={draggable}
        onDragEnd={(e) => {
          if (!draggable) return;
          const { lat, lng } = e.lngLat;
          onDragEnd?.(station, { lat, lng });
        }}
      >
        <img
          src={BusIcon}
          alt={station.name}
          className={`size-10 shrink-0 group-data-[collapsible=icon]:justify-center`}
        />
        {station.name}
      </Marker>
    </>
  );
}

export { BusStation };
