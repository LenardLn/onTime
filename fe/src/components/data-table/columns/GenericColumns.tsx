import { Button } from "@/components/shadcn/button";
import type { Line } from "@/entities/line";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface LineColumnsProps {
  getDetailPath: (row: any) => string;
  actionColumnName?: string;
}

export const useLineColumns = ({
  getDetailPath,
  actionColumnName,
}: LineColumnsProps): ColumnDef<Line>[] => {
  const navigate = useNavigate();
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
        <Button onClick={() => navigate(getDetailPath(row.original))}>
          View
        </Button>
      ),
    },
  ];
};
