import { Button } from "@/components/shadcn/button";
import type { Line } from "@/entities/line";
import useDeleteRoute from "@/hooks/admin/tanstack/useDeleteRouts";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
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

  const { mutateAsync: deleteRoute } = useDeleteRoute();

  const renderActions = (row: Line) => {
    return (
      <div className="flex gap-2">
        {!row.has_route ? (
          <Button
            className="text-lg"
            onClick={() => navigate(getCreateRoutePath(row.id))}
          >
            <Plus className="!size-4" />
            {t("routesPage.createRoute")}
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="text-lg"
              onClick={() => navigate(getDetailPath(row.id))}
            >
              <Eye className="!size-4" />
              {t("admin.viewRoute")}
            </Button>
            <Button
              variant="outline"
              className="text-lg"
              onClick={() => navigate(getEditRoutePath(row.id))}
            >
              <Pencil className="!size-4" />
              {t("admin.edit")}
            </Button>
            <Button
              variant="destructive"
              className="text-lg"
              onClick={async () => {
                await deleteRoute(row.id.toString());
              }}
            >
              <Trash2 className="!size-4" />
              {t("admin.delete")}
            </Button>
          </>
        )}
      </div>
    );
  };

  return [
    {
      accessorKey: "name",
      header: t("admin.name"),
    },
    {
      id: "actions",
      header: t(`admin.${actionColumnName ? actionColumnName : "action"}`),
      cell: ({ row }) => {
        return <>{renderActions(row.original)}</>;
      },
    },
  ];
};
