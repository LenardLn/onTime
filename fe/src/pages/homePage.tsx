import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ViewMap from "../components/map/ViewMap";
import HomeControls, {
  type DataSource,
} from "../components/home/HomeControls";
import useRoute from "../hooks/admin/tanstack/useRoute";
import useLiveBuses from "../hooks/tanstack/useLiveBuses";
import useClosestBus from "../hooks/tanstack/useClosestBus";
import { BusFront, X } from "lucide-react";
import useUserLocation from "../hooks/useUserLocation";
import useWalkingRoute from "../hooks/tanstack/useWalkingRoute";
import type { Station } from "../entities/route";
import { axiosInstance } from "../apiConfig";
import "../css/HomePage.css";

const HomePage = () => {
  const { t } = useTranslation();
  const [selectedLineId, setSelectedLineId] = useState<number | undefined>();
  const [targetStation, setTargetStation] = useState<Station | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>("live");

  // Stop the simulation if the page is refreshed/closed while it's running.
  const runningRef = useRef(false);
  runningRef.current = simulationRunning;
  useEffect(() => {
    const stopOnUnload = () => {
      if (runningRef.current) {
        navigator.sendBeacon(
          `${axiosInstance.defaults.baseURL}simulation/stop`,
        );
      }
    };
    window.addEventListener("beforeunload", stopOnUnload);
    return () => window.removeEventListener("beforeunload", stopOnUnload);
  }, []);

  const { data: routeResponse } = useRoute({
    line_ids: selectedLineId ? [selectedLineId] : undefined,
  });
  // In live mode the driver app feeds bus_locations directly, so poll as soon
  // as a line is selected; in simulation mode only while the simulator runs.
  const shouldPoll =
    dataSource === "live" ? Boolean(selectedLineId) : simulationRunning;
  const { data: liveBuses } = useLiveBuses(
    shouldPoll ? selectedLineId : undefined,
    dataSource === "live",
  );

  // Closest bus *approaching* the selected station along the route
  // (direction-aware on the backend).
  const { data: closestBusData } = useClosestBus(
    selectedLineId,
    targetStation ? Number(targetStation.id) : undefined,
    dataSource === "live",
    shouldPoll,
  );
  const closestBus = shouldPoll ? closestBusData?.bus : null;

  const { location, enable } = useUserLocation();

  const { data: walkingRoute } = useWalkingRoute(
    location,
    targetStation ? { lat: targetStation.lat, lon: targetStation.long } : null,
  );

  const handleSelectStation = (station: Station) => {
    setTargetStation(station);
    enable(); // make sure we have a live origin for the walking route
  };

  const handleSelectLine = (lineId?: number) => {
    setSelectedLineId(lineId);
    setTargetStation(null); // the station belongs to the previous line
  };

  const formatDistance = (meters: number) =>
    meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1)} km`;

  return (
    <div className="home-map relative h-screen">
      <div className="absolute inset-0 z-0">
        <ViewMap
          mode="view"
          routeData={routeResponse?.response}
          liveBuses={liveBuses}
          userLocation={location}
          walkingRoute={walkingRoute}
          onSelectStation={handleSelectStation}
          highlightBusId={closestBus?.bus_id}
        />
      </div>

      <HomeControls
        selectedLineId={selectedLineId}
        onSelectLine={handleSelectLine}
        running={simulationRunning}
        onStarted={() => setSimulationRunning(true)}
        onStopped={() => setSimulationRunning(false)}
        dataSource={dataSource}
        onChangeDataSource={setDataSource}
        busCount={liveBuses?.length ?? 0}
      />

      {targetStation && (
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4 rounded-2xl border bg-background/90 px-5 py-4 shadow-xl backdrop-blur">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BusFront className="size-6" />
          </div>
          <div className="leading-snug">
            <p className="text-lg font-semibold">{targetStation.name}</p>
            {closestBus ? (
              <p className="text-base text-muted-foreground">
                {t("home.closestBus", {
                  bus: closestBus.bus_name,
                  distance: formatDistance(closestBus.distance_m),
                  minutes: Math.max(
                    1,
                    Math.round(closestBus.eta_seconds / 60),
                  ),
                })}
              </p>
            ) : (
              <p className="text-base text-muted-foreground">
                {t("home.noBusApproaching")}
              </p>
            )}
          </div>
          <button
            onClick={() => setTargetStation(null)}
            title={t("admin.cancel")}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground hover:cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>
      )}

      <button
        onClick={enable}
        title={t("home.myLocation")}
        className="absolute bottom-8 right-4 z-30 flex size-12 items-center justify-center rounded-full bg-background/90 shadow-lg backdrop-blur hover:bg-background"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="6" />
          <line x1="12" y1="1" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="1" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="23" y2="12" />
        </svg>
      </button>
    </div>
  );
};

export default HomePage;
