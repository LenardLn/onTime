import { useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ConfirmDialog from "@/components/confirm-dialog/ConfirmDialog";
import { Button } from "@/components/shadcn/button";
import type { Line } from "@/entities/line";
import useDeleteLine from "@/hooks/admin/tanstack/useDeleteLine";
import useDeleteRoute from "@/hooks/admin/tanstack/useDeleteRouts";

type LineActionsProps = {
  line: Line;
  getDetailPath: (id: string | number) => string;
  getCreateRoutePath: (id: string | number) => string;
  getEditRoutePath: (id: string | number) => string;
};

const LineActions = ({
  line,
  getDetailPath,
  getCreateRoutePath,
  getEditRoutePath,
}: LineActionsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { mutateAsync: deleteRoute } = useDeleteRoute();
  const { mutateAsync: deleteLine, isPending: isDeletingLine } = useDeleteLine();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteLine = async () => {
    try {
      await deleteLine(line.id);
      toast.success(t("routesPage.lineDeleted", { name: line.name }));
      setConfirmOpen(false);
    } catch (err: any) {
      toast.warning(t(err.message ?? err));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {!line.has_route ? (
        <Button
          className="text-lg"
          onClick={() => navigate(getCreateRoutePath(line.id))}
        >
          <Plus className="!size-4" />
          {t("routesPage.createRoute")}
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            className="text-lg"
            onClick={() => navigate(getDetailPath(line.id))}
          >
            <Eye className="!size-4" />
            {t("admin.viewRoute")}
          </Button>
          <Button
            variant="outline"
            className="text-lg"
            onClick={() => navigate(getEditRoutePath(line.id))}
          >
            <Pencil className="!size-4" />
            {t("admin.edit")}
          </Button>
          <Button
            variant="destructive"
            className="text-lg"
            onClick={async () => {
              await deleteRoute(line.id.toString());
            }}
          >
            <Trash2 className="!size-4" />
            {t("routesPage.deleteRoute")}
          </Button>
        </>
      )}

      <Button
        variant="destructive"
        className="text-lg"
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="!size-4" />
        {t("routesPage.deleteLine")}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("routesPage.deleteLine")}
        description={t("routesPage.deleteLineConfirm", { name: line.name })}
        onConfirm={handleDeleteLine}
        isPending={isDeletingLine}
      />
    </div>
  );
};

export default LineActions;
