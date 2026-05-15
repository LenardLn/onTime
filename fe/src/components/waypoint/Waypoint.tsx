import {
    Marker,
    type MarkerEvent,
} from "@vis.gl/react-maplibre";
import type { BaseCoordinates } from '@/helpers/baseCoordinates';
import MarkerInfoCard from "../marker-info-card/MarkerInfoCard";
import { useState } from "react";
import BusIcon from "@/assets/toggle.svg"
type LatLng = {
    lat: number;
    lng: number;
};

type BusStationProps = {
    waypoint: BaseCoordinates,
    onDragEnd?: (station: BaseCoordinates, { lat, lng }: LatLng) => void
    draggable?: boolean,
    addWaypoint?: () => void
}

function Waypoint({ waypoint, onDragEnd, draggable = false }: BusStationProps) {
    const [open, setOpen] = useState(false);
    return (
        <Marker
            latitude={waypoint.lat}
            longitude={waypoint.long}
            color="red"
            draggable={draggable}
            onDragEnd={(e) => {
                if (!draggable) return
                const { lat, lng } = e.lngLat;

                console.log("dragged waypoint:", waypoint.id, { lat, lng });

                onDragEnd?.(waypoint, { lat, lng });
            }}
        >
            <div onClick={(e) => {
                console.log("left click", e.button); // 0
            }}
                onContextMenu={(e) => {
                    e.preventDefault();

                    console.log("right click", e.button); // 2
                    setOpen(true)
                }}>
                <img
                    src={BusIcon}
                    className={`size-7.5 shrink-0 group-data-[collapsible=icon]:justify-center`}
                />
            </div>

            {open && <MarkerInfoCard />}
        </Marker>


    )
}

export { Waypoint }

