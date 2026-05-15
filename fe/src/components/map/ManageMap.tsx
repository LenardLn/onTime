import {
  Map,
  NavigationControl,
  Source,
  Layer,
  Marker,
  type MapLayerMouseEvent,
  type MarkerEvent,
} from "@vis.gl/react-maplibre";
import type { FeatureCollection, LineString } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import Markers from "../markers/Markers";
import { useThemeContext } from "../contexts/ThemeContextProvider";
import type { BaseCoordinates } from "@/helpers/baseCoordinates";
import { useEffect, useMemo, useState } from "react";
import useCreateRoute from "@/hooks/admin/tanstack/useCreateRoute";
import { Button } from "../shadcn/button";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import useRoute from "@/hooks/admin/tanstack/useRoute";
import type { Station } from "@/entities/route";
import { BusStation } from "../station/BusStation";
import { Waypoint } from "../waypoint/Waypoint";

const ManageMap = () => {
  const location = useLocation();
  const { theme } = useThemeContext();
  const { id } = useParams();

  const [waypoints, setWaypoints] = useState<BaseCoordinates[]>([]);
  const [coord, setCoord] = useState<BaseCoordinates[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<BaseCoordinates[]>([]);
  const [stations, setStations] = useState<Station[]>([])
  const [insertInfo, setInserInfo] = useState({ waypoint: "", insert: "" })

  const [isCreate, setIsCreate] = useState(false)


  const isEdit = useMemo(() => location.pathname.includes('/edit'), []);

  const {
    data,
    // isLoading,
    // isError,
    // error
  } = useRoute({ line_ids: [id!] });

  useEffect(() => {
    const routeData = data?.response?.[0];
    if (!isEdit || !routeData) return;

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

  const bounds: [[number, number], [number, number]] = [
    [23.439274, 47.617155], // SW [lng, lat]
    [23.729459, 47.686301], // NE [lng, lat]
  ];

  const addMarker = (e: MapLayerMouseEvent) => {
    // if (mode !== "edit") return;

    const { lat, lng } = e.lngLat;

    const newMarker: BaseCoordinates = {
      lat: lat,
      long: lng,
      order_index: waypoints.length,
      line_id: Number(id!),
    };

    setWaypoints((prev) => [...prev, newMarker]);
  };

  const handleOpenedMarkers = (
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

  const handleMarkerDragEnd = (
    oldMarker: BaseCoordinates,
    newCoords: { lat: number; lng: number },
  ) => {

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

  const drawBusRoute = async () => {
    if (waypoints.length < 2) return;

    const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

    const lastTwo = waypoints.slice(-2);
    let coordonates;
    if (isCreate) {
      coordonates = lastTwo.map((c) => `${c.lat},${c.long}`).join("|");
    } else {
      coordonates = waypoints.map((c) => `${c.lat},${c.long}`).join("|");

    }



    const response = await axios.get(
      `https://api.geoapify.com/v1/routing?waypoints=${coordonates}&mode=drive&apiKey=${GEOAPIFY_KEY}`,
    );

    const geometry = response.data.features?.[0]?.geometry;

    if (!geometry) return;

    const coords: [number, number][] = geometry.coordinates.flat();

    const newSegment: BaseCoordinates[] = coords.map((r, index) => ({
      lat: r[1],
      long: r[0],
      line_id: Number(id!),
      order_index: coord.length + index,
    }));

    if (isCreate) {
      setCoord((prev) => {
        if (prev.length === 0) return newSegment;

        return [...prev, ...newSegment.slice(1)];
      });

    } else {
      setCoord(newSegment)
    }

  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      drawBusRoute();
    }, 400);

    return () => clearTimeout(timeout);
  }, [waypoints]);

  function renderRoute(
    route: { long: number; lat: number; order_index: number }[],
  ) {
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
  }

  const handleStationDragEnd = (
    station: Station,
    coords: { lat: number; lng: number }
  ) => {
    console.log("station moved:", station.id, coords);

    setStations((prev) =>
      prev.map((s) =>
        s.id === station.id
          ? { ...s, lat: coords.lat, long: coords.lng }
          : s
      )
    );
  };

  const handleWaypointDragEnd = (
    waypoint: BaseCoordinates,
    coords: { lat: number; lng: number }
  ) => {
    console.log("station moved:", waypoint.id, coords);

    console.log(waypoint.id, waypoint)

    setWaypoints((prev) =>
      prev.map((s) =>
        s.id === waypoint.id
          ? { ...s, lat: coords.lat, long: coords.lng }
          : s
      )
    );
  };

  return (
    <>
      <Button
        className="z-100"
        onClick={async () => await handleCreateRoute(coord, waypoints)}
      >
        Create Route test
      </Button>
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
          markers={waypoints}
          handleMarkers={handleOpenedMarkers}
          selectedMarkers={selectedMarker}
          onDragEnd={handleMarkerDragEnd}
        />
        {waypoints.map((item, i) => {
          return (
            <Waypoint
              key={item.id}
              waypoint={item}
              draggable
              onDragEnd={handleWaypointDragEnd} />

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
      </Map>
    </>
  );
};

export default ManageMap;
