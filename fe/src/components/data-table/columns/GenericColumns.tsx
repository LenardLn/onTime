import LineActions from "@/components/line/LineActions";
import type { Line } from "@/entities/line";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface LineColumnsProps {
  getDetailPath: (id: string | number) => string;
  getCreateRoutePath: (id: string | number) => string;
  getEditRoutePath: (id: string | number) => string;
  actionColumnName?: string;
}

export const useLineColumns = ({
  getDetailPath,
  getCreateRoutePath,
  getEditRoutePath,
  actionColumnName,
}: LineColumnsProps): ColumnDef<Line>[] => {
  const { t } = useTranslation();

  return [
    {
      accessorKey: "name",
      header: t("admin.name"),
    },
    {
      id: "actions",
      header: t(`admin.${actionColumnName ? actionColumnName : "action"}`),
      cell: ({ row }) => (
        <LineActions
          line={row.original}
          getDetailPath={getDetailPath}
          getCreateRoutePath={getCreateRoutePath}
          getEditRoutePath={getEditRoutePath}
        />
      ),
    },
  ];
};
