import { useEffect, useRef } from "react";
import { useMapEditorContext } from "../contexts/mapEditorContext";
import { Button } from "../shadcn/button";

interface MarkerInfoCardProps {
  name?: string;
}

const MarkerInfoCard = ({ name }: MarkerInfoCardProps) => {
  const { setMode, setJustClosed } = useMapEditorContext();

  const cardRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      setMode("idle");
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
          setMode("insert_before");
        }}
        variant={"ghost"}
      >
        Insert Before
      </Button>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          setMode("insert_after");
        }}
        variant={"ghost"}
      >
        Insert After
      </Button>
    </div>
  );
};

export default MarkerInfoCard;
