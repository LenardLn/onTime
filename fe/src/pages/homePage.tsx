import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ViewMap from "../components/map/ViewMap";
import HomeControls from "../components/home/HomeControls";
import useRoute from "../hooks/admin/tanstack/useRoute";
import useLiveBuses from "../hooks/tanstack/useLiveBuses";
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
  // Live buses only while the simulation is running.
  const { data: liveBuses } = useLiveBuses(
    simulationRunning ? selectedLineId : undefined,
  );

  const { location, enable } = useUserLocation();

  const { data: walkingRoute } = useWalkingRoute(
    location,
    targetStation ? { lat: targetStation.lat, lon: targetStation.long } : null,
  );

  const handleSelectStation = (station: Station) => {
    setTargetStation(station);
    enable(); // make sure we have a live origin for the walking route
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <ViewMap
          mode="view"
          routeData={routeResponse?.response}
          liveBuses={liveBuses}
          userLocation={location}
          walkingRoute={walkingRoute}
          onSelectStation={handleSelectStation}
        />
      </div>

      <HomeControls
        selectedLineId={selectedLineId}
        onSelectLine={setSelectedLineId}
        running={simulationRunning}
        onStarted={() => setSimulationRunning(true)}
        onStopped={() => setSimulationRunning(false)}
      />

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
