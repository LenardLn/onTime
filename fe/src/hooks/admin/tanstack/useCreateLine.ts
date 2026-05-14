import { createLine } from "@/apis/admin.api";
import { useMutation } from "@tanstack/react-query";

const useCreateLine = () => {
  return useMutation<string, Error, string>({
    mutationFn: (name: string) => createLine(name),
  });
};

export default useCreateLine;
