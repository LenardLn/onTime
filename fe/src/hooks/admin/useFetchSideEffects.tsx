import { useEffect } from "react";
import { toast } from "sonner";
import { t } from "i18next";

type Props = {
  isError: boolean;
  error: unknown;
};

const useErrorMessage = ({ isError, error }: Props) => {
  useEffect(() => {
    if (isError && error instanceof Error) {
      toast.error(t(error.message));
    }
  }, [isError, error]);
};

export default useErrorMessage;
