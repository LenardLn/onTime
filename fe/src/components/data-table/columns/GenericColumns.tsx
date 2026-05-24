import { Button } from "@/components/shadcn/button";
import type { Line } from "@/entities/line";
import useDeleteRoute from "@/hooks/admin/tanstack/useDeleteRouts";
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

  const { mutateAsync: deleteRoute } = useDeleteRoute();

  const renderActions = (row: Line) => {
    return (
      <>
        {!row.has_route ? (
          <Button
            onClick={() => navigate(getCreateRoutePath(row.id))}
          >
            Create Route
          </Button>
        ) : (
          <>
            <Button
              onClick={() => navigate(getEditRoutePath(row.id))}
            >
              Edit Route
            </Button>
            <Button onClick={() => navigate(getDetailPath(row.id))}>
              View
            </Button>

            <Button
              onClick={async () => {
                await deleteRoute(row.id.toString());
              }}
            >
              Delete Route
            </Button>
          </>
        )}
      </>
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

        console.log(row.original)

        return (
          <>
            {renderActions(row.original)}
          </>
        );
      },
    },
  ];
};
