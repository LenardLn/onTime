import { Marker } from "@vis.gl/react-maplibre";
import type { BaseCoordinates } from "@/helpers/baseCoordinates";
import MarkerInfoCard from "../marker-info-card/MarkerInfoCard";
import BusIcon from "@/assets/waypoint.svg";
import { useMapEditorContext } from "../contexts/mapEditorContext";
type LatLng = {
  lat: number;
  lng: number;
};

type BusStationProps = {
  waypoint: BaseCoordinates;
  onDragEnd?: (station: BaseCoordinates, { lat, lng }: LatLng) => void;
  draggable?: boolean;
  addWaypoint?: () => void;
};

const Waypoint = ({
  waypoint,
  onDragEnd,
  draggable = false,
}: BusStationProps) => {
  const { mode, setMode, selectedWaypoint, setSelectedWaypoint } =
    useMapEditorContext();

  return (
    <Marker
      latitude={waypoint.lat}
      longitude={waypoint.long}
      color="red"
      draggable={mode === "idle" && draggable}
      onDragEnd={(e) => {
        if (!draggable) return;
        const { lat, lng } = e.lngLat;

        onDragEnd?.(waypoint, { lat, lng });
      }}
    >
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setSelectedWaypoint(waypoint);
          setMode("selected");
        }}
      >
        <span className="absolute -translate-y-[25px] -translate-x-[5px]">
          {waypoint.order_index + 1}
        </span>
        <img
          src={BusIcon}
          className={`size-10 shrink-0 group-data-[collapsible=icon]:justify-center -translate-y-[15px]`}
        />
      </div>

      {mode === "selected" &&
        selectedWaypoint?.lat === waypoint.lat &&
        selectedWaypoint.long === waypoint.long && <MarkerInfoCard />}
    </Marker>
  );
};

export { Waypoint };
