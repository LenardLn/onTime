import {
  Source,
  Layer,
  type MapLayerMouseEvent,
  type MarkerEvent,
} from "@vis.gl/react-maplibre";
import type { FeatureCollection, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import Markers from "../markers/Markers";
import type { BaseCoordinates } from "@/helpers/baseCoordinates";
import { useEffect, useMemo, useRef, useState } from "react";
import useCreateRoute from "@/hooks/admin/tanstack/useCreateRoute";
import { Button } from "../shadcn/button";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import useRoute from "@/hooks/admin/tanstack/useRoute";
import type { RouteUpdateType, Station } from "@/entities/route";
import { BusStation } from "../station/BusStation";
import { Waypoint } from "../waypoint/Waypoint";
import BaseMap from "./BaseMap";
import { useMapEditorContext } from "../contexts/mapEditorContext";

const ManageMap = () => {
  const location = useLocation();
  const { id } = useParams();

  const [waypoints, setWaypoints] = useState<BaseCoordinates[]>([]);
  const [coord, setCoord] = useState<BaseCoordinates[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<BaseCoordinates[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  const { justClosed, setJustClosed, mode, setMode, selectedWaypoint } =
    useMapEditorContext();

  const routeUpdateTypeRef = useRef<RouteUpdateType>("append");

  const initialLoadDone = useRef(false);

  const setUpdate = (type: RouteUpdateType) => {
    routeUpdateTypeRef.current = type;
  };

  const isEdit = useMemo(() => location.pathname.includes("/edit"), []);

  const isInsertionMode = mode === "insert_after" || mode === "insert_before";

  const {
    data,
    // isLoading,
    // isError,
    // error
  } = useRoute({ line_ids: [id!] });

  useEffect(() => {
    const routeData = data?.response?.[0];
    if (!isEdit || !routeData) return;

    initialLoadDone.current = false;
    setCoord(routeData.routes);
    setStations(routeData.stations);
    setWaypoints(routeData.waypoints);
  }, [data?.response, isEdit]);

  const { mutateAsync: createRoute } = useCreateRoute();

  const handleCreateRoute = async (
    coord: BaseCoordinates[],
    waypoints: BaseCoordinates[],
  ) => {
    createRoute({
      routes: coord,
      waypoints: waypoints,
    });
  };

  const handleInsertWaypoint = (e: MapLayerMouseEvent) => {
    const { lat, lng } = e.lngLat;

    if (isInsertionMode) {
      if (!selectedWaypoint) return;

      const selectedIndex = waypoints.findIndex(
        (w) =>
          w.lat === selectedWaypoint?.lat && w.long === selectedWaypoint?.long,
      );
      if (selectedIndex === -1) return;

      const insertIndex =
        mode === "insert_before" ? selectedIndex : selectedIndex + 1;

      const newMarker = {
        lat,
        long: lng,
        line_id: selectedWaypoint.line_id,
        order_index: insertIndex,
      };
      setUpdate("full");
      setWaypoints((prev) => {
        const newWaypoints = [...prev];
        newWaypoints.splice(insertIndex, 0, newMarker);

        return newWaypoints.map((w, i) => ({
          ...w,
          order_index: i,
        }));
      });
      setMode("idle");
      return;
    }

    if (mode !== "idle") {
      setMode("idle");
      return;
    }

    addMarker(e);
  };

  const addMarker = (e: MapLayerMouseEvent) => {
    if (justClosed) {
      setJustClosed(false);
      return;
    }

    if (isInsertionMode) setMode("idle");

    setUpdate("append");

    const { lat, lng } = e.lngLat;

    const newMarker: BaseCoordinates = {
      lat: lat,
      long: lng,
      order_index: waypoints.length,
      line_id: Number(id!),
    };

    setWaypoints((prev) => [...prev, newMarker]);
  };

  const handleOpenedMarkers = async (
    e: MarkerEvent<MouseEvent>,
    marker: BaseCoordinates,
  ) => {
    e.originalEvent.stopPropagation();
    setSelectedMarker((prev) => {
      const exists = prev.some(
        (m) => m.lat === marker.lat && m.long === marker.long,
      );
      if (exists) {
        return prev.filter(
          (m) => m.lat !== marker.lat || m.long !== marker.long,
        );
      }
      return [...prev, marker];
    });
  };

  const handleMarkerDragEnd = async (
    oldMarker: BaseCoordinates,
    newCoords: { lat: number; lng: number },
  ) => {
    setUpdate("move");
    setWaypoints((prev) =>
      prev.map((m) =>
        m.lat === oldMarker.lat && m.long === oldMarker.long
          ? {
              lat: newCoords.lat,
              long: newCoords.lng,
              order_index: m.order_index,
              line_id: Number(id!),
            }
          : m,
      ),
    );
  };

  // more optimised geoapify stuff

  // const drawBusRoute = async () => {
  //   if (waypoints.length < 2) return;

  //   const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

  //   let coordonates = "";

  //   if (routeUpdateType === "append") {
  //     const lastTwo = waypoints.slice(-2);
  //     coordonates = lastTwo.map((c) => `${c.lat},${c.long}`).join("|");
  //   } else if (routeUpdateType === "insert" || routeUpdateType === "move") {
  //     const insertedIndex = waypoints.findIndex(
  //       (w) => w.order_index === selectedWaypoint?.order_index,
  //     );

  //     const prev = waypoints[insertedIndex - 1];
  //     const curr = waypoints[insertedIndex];
  //     const next = waypoints[insertedIndex + 1];

  //     if (prev && curr && next) {
  //       coordonates = [
  //         `${prev.lat},${prev.long}`,
  //         `${curr.lat},${curr.long}`,
  //         `${next.lat},${next.long}`,
  //       ].join("|");
  //     }
  //   }

  //   if (!coordonates) return;

  //   const response = await axios.get(
  //     `https://api.geoapify.com/v1/routing?waypoints=${coordonates}&mode=drive&apiKey=${GEOAPIFY_KEY}`,
  //   );

  //   const geometry = response.data.features?.[0]?.geometry;

  //   if (!geometry) return;

  //   const coords: [number, number][] = geometry.coordinates.flat();

  //   const newSegment: BaseCoordinates[] = coords.map((r, index) => ({
  //     lat: r[1],
  //     long: r[0],
  //     line_id: Number(id!),
  //     order_index: coord.length + index,
  //   }));

  //   if (routeUpdateType === "append") {
  //     setCoord((prev) => {
  //       if (prev.length === 0) return newSegment;

  //       return [...prev, ...newSegment.slice(1)];
  //     });
  //   } else {
  //     setCoord(newSegment);
  //   }
  // };

  const drawBusRoute = async () => {
    if (waypoints.length < 2) return;

    const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
    const updateType = routeUpdateTypeRef.current; // ← read from ref, not state

    const coordinates =
      updateType === "append"
        ? waypoints
            .slice(-2)
            .map((c) => `${c.lat},${c.long}`)
            .join("|")
        : waypoints.map((c) => `${c.lat},${c.long}`).join("|");

    const response = await axios.get(
      `https://api.geoapify.com/v1/routing?waypoints=${coordinates}&mode=drive&apiKey=${GEOAPIFY_KEY}`,
    );

    const geometry = response.data.features?.[0]?.geometry;
    if (!geometry) return;

    const flat: [number, number][] =
      geometry.type === "MultiLineString"
        ? geometry.coordinates.flat(1)
        : geometry.coordinates;

    const newSegment = flat.map((r, i) => ({
      lat: r[1],
      long: r[0],
      line_id: Number(id!),
      order_index: i,
    }));

    if (updateType === "append") {
      setCoord((prev) =>
        prev.length === 0 ? newSegment : [...prev, ...newSegment.slice(1)],
      );
    } else {
      setCoord(newSegment);
    }
  };

  useEffect(() => {
    if (waypoints.length < 2) return;
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      return;
    }

    const timeout = setTimeout(() => {
      drawBusRoute();
    }, 400);

    return () => clearTimeout(timeout);
  }, [waypoints]);

  const renderRoute = (
    route: { long: number; lat: number; order_index: number }[],
  ) => {
    if (route.length < 1) return;

    const geojson: FeatureCollection<LineString> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: route?.map((m) => [Number(m.long), Number(m.lat)]),
          },
          properties: {},
        },
      ],
    };

    return (
      <Source
        key={JSON.stringify(route)}
        id={"1"}
        type="geojson"
        data={geojson}
      >
        <Layer
          id={"1"}
          type="line"
          paint={{
            "line-color": "red",
            "line-width": 4,
          }}
        />
      </Source>
    );
  };

  const handleStationDragEnd = (
    station: Station,
    coords: { lat: number; lng: number },
  ) => {
    setStations((prev) =>
      prev.map((s) =>
        s.lat === station.lat && s.long === station.long
          ? { ...s, lat: coords.lat, long: coords.lng }
          : s,
      ),
    );
  };

  const handleWaypointDragEnd = (
    waypoint: BaseCoordinates,
    coords: { lat: number; lng: number },
  ) => {
    setUpdate("full");
    setWaypoints((prev) =>
      prev.map((s) =>
        s.lat === waypoint.lat && s.long === waypoint.long
          ? { ...s, lat: coords.lat, long: coords.lng }
          : s,
      ),
    );
  };

  return (
    <>
      <div className="flex absolute z-20 p-2.5">
        <Button
          className="z-100"
          onClick={async () => await handleCreateRoute(coord, waypoints)}
        >
          Create Route test
        </Button>
      </div>
      <BaseMap
        handleAddMarker={isInsertionMode ? handleInsertWaypoint : addMarker}
      >
        <Markers
          markers={waypoints}
          handleMarkers={handleOpenedMarkers}
          selectedMarkers={selectedMarker}
          onDragEnd={handleMarkerDragEnd}
        />
        {waypoints.map((item) => {
          return (
            <Waypoint
              key={item.id}
              waypoint={item}
              draggable
              onDragEnd={handleWaypointDragEnd}
            />
          );
        })}
        {stations.map((item, index) => (
          <BusStation
            key={item.id || index}
            station={item}
            draggable
            onDragEnd={handleStationDragEnd}
          />
        ))}
        {renderRoute(coord)}
      </BaseMap>
    </>
  );
};

export default ManageMap;
