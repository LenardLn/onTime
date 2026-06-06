import { stopSimulation } from "@/apis/simulation.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const useStopSimulation = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: stopSimulation,
    onSuccess: () => toast.success(t("home.simulationStopped")),
    onError: (error: Error) => toast.error(error.message),
  });
};

export default useStopSimulation;
