import { useTranslation } from "react-i18next";
import useLines from "@/hooks/admin/tanstack/useLines";
import useStartSimulation from "@/hooks/tanstack/useStartSimulation";
import useStopSimulation from "@/hooks/tanstack/useStopSimulation";
import { Button } from "@/components/shadcn/button";

type HomeControlsProps = {
  selectedLineId?: number;
  onSelectLine: (lineId?: number) => void;
  running: boolean;
  onStarted?: () => void;
  onStopped?: () => void;
};

const HomeControls = ({
  selectedLineId,
  onSelectLine,
  running,
  onStarted,
  onStopped,
}: HomeControlsProps) => {
  const { t } = useTranslation();
  const { data: lines } = useLines();
  const startSimulation = useStartSimulation();
  const stopSimulation = useStopSimulation();

  return (
    <div className="absolute top-16 left-4 z-30 flex w-64 flex-col gap-3 rounded-xl bg-background/90 p-4 shadow-lg backdrop-blur">
      <label className="text-sm font-medium">{t("home.selectLine")}</label>
      <select
        className="rounded-md border bg-background px-3 py-2 text-foreground"
        value={selectedLineId ?? ""}
        onChange={(e) =>
          onSelectLine(e.target.value ? Number(e.target.value) : undefined)
        }
      >
        <option value="">{t("home.linePlaceholder")}</option>
        {lines?.map((line) => (
          <option key={line.id} value={line.id}>
            {line.name}
          </option>
        ))}
      </select>

      {running ? (
        <Button
          variant="destructive"
          onClick={() =>
            stopSimulation.mutate(undefined, { onSuccess: () => onStopped?.() })
          }
          disabled={stopSimulation.isPending}
        >
          {stopSimulation.isPending
            ? t("home.stopping")
            : t("home.stopSimulation")}
        </Button>
      ) : (
        <Button
          onClick={() =>
            startSimulation.mutate(undefined, {
              onSuccess: () => onStarted?.(),
            })
          }
          disabled={startSimulation.isPending}
        >
          {startSimulation.isPending
            ? t("home.starting")
            : t("home.startSimulation")}
        </Button>
      )}
    </div>
  );
};

export default HomeControls;
