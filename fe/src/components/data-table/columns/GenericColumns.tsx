import { Button } from "@/components/shadcn/button";
import type { Line } from "@/entities/line";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
      cell: ({ row }) => {
        return (
          <>
            <Button onClick={() => navigate(getDetailPath(row.original.id))}>
              View
            </Button>
            <Button
              onClick={() => navigate(getCreateRoutePath(row.original.id))}
            >
              Create Route
            </Button>
            <Button
              onClick={() => navigate(getEditRoutePath(row.original.id))}
            >
              Edit route
            </Button>
          </>
        );
      },
    },
  ];
};
