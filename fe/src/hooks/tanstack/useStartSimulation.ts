import { startSimulation } from "@/apis/simulation.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const useStartSimulation = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: startSimulation,
    onSuccess: () => toast.success(t("home.simulationStarted")),
    onError: (error: Error) => toast.error(error.message),
  });
};

export default useStartSimulation;
