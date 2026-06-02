import { useEffect, useRef } from "react";
import { MapEditModeEnum, useMapEditorContext } from "../contexts/mapEditorContext";
import { Button } from "../shadcn/button";
import type { BaseCoordinates } from "@/helpers/baseCoordinates";

interface MarkerInfoCardProps {
  name?: string;
  marker?: BaseCoordinates
}

const MarkerInfoCard = ({ name, marker }: MarkerInfoCardProps) => {
  const { setMode, setJustClosed, setSelectedWaypoint } = useMapEditorContext();

  const cardRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      setMode(MapEditModeEnum.Idle);
      setJustClosed(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="marker-info-card absolute -translate-y-[100px] translate-x-[10px] bg-white px-3 py-2 rounded shadow-2xl flex flex-col gap-2"
      ref={cardRef}
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setMode(MapEditModeEnum.InsertBefore);
        }}
        variant={"ghost"}
      >
        Insert Before
      </Button>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          setMode(MapEditModeEnum.InsertAfter);
        }}
        variant={"ghost"}
      >
        Insert After
      </Button>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          if (!marker) return

          setSelectedWaypoint(marker)
          setMode(MapEditModeEnum.Delete);
        }}
        variant={"ghost"}
      >
        Delete
      </Button>
    </div>
  );
};

export default MarkerInfoCard;
