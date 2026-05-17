import { createContext, useContext, useState, type ReactNode } from "react";
import type { BaseCoordinates } from "@/helpers/baseCoordinates";

export type MapEditMode =
  | "idle"
  | "selected"
  | "insert_before"
  | "insert_after";

interface MapEditorContextType {
  mode: MapEditMode;
  setMode: (mode: MapEditMode) => void;

  selectedWaypoint: BaseCoordinates | null;
  setSelectedWaypoint: (w: BaseCoordinates | null) => void;

  justClosed: boolean;
  setJustClosed: (v: boolean) => void;

  isLocked: boolean;
}

const MapEditorContext = createContext<MapEditorContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const MapEditorProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<MapEditMode>("idle");
  const [selectedWaypoint, setSelectedWaypoint] =
    useState<BaseCoordinates | null>(null);
  const [justClosed, setJustClosed] = useState(false);

  const isLocked = mode === "selected";

  return (
    <MapEditorContext.Provider
      value={{
        mode,
        setMode,
        selectedWaypoint,
        setSelectedWaypoint,
        isLocked,
        justClosed,
        setJustClosed,
      }}
    >
      {children}
    </MapEditorContext.Provider>
  );
};

export const useMapEditorContext = () => {
  const context = useContext(MapEditorContext);
  if (!context)
    throw new Error("useMapEditorContext must be used inside provider");
  return context;
};
