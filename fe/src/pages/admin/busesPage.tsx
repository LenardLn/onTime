import ConfirmDialog from "@/components/confirm-dialog/ConfirmDialog";
import { DataTable } from "@/components/data-table/DataTable";
import PageLoader from "@/components/loaders/PageLoader";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import type { Bus, CreateBusPayload } from "@/entities/bus";
import useBuses from "@/hooks/admin/tanstack/useBuses";
import useCreateBus from "@/hooks/admin/tanstack/useCreateBus";
import useDeleteBus from "@/hooks/admin/tanstack/useDeleteBus";
import useLines from "@/hooks/admin/tanstack/useLines";
import useUpdateBus from "@/hooks/admin/tanstack/useUpdateBus";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";
import type { ColumnDef } from "@tanstack/react-table";
import { BusFront, Pencil, Plus, Route as RouteIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type BusForm = {
  name: string;
  line_id: string;
};

const BusesPage = () => {
  const { t } = useTranslation();

  const { data: buses, isLoading, isError, error } = useBuses();
  const { data: lines } = useLines();
  const { mutateAsync: createBus, isPending: isCreating } = useCreateBus();
  const { mutateAsync: updateBus, isPending: isUpdating } = useUpdateBus();
  const { mutateAsync: deleteBus, isPending: isDeleting } = useDeleteBus();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [deletingBus, setDeletingBus] = useState<Bus | null>(null);

  const { handleSubmit, control, reset } = useForm<BusForm>({
    defaultValues: { name: "", line_id: "" },
  });

  useErrorMessage({ isError, error });

  const lineNameForId = (id: number) =>
    lines?.find((line) => line.id === id)?.name ?? `#${id}`;

  const openCreate = () => {
    reset({ name: "", line_id: "" });
    setCreateOpen(true);
  };

  const openEdit = (bus: Bus) => {
    setEditingBus(bus);
    reset({ name: bus.name, line_id: String(bus.line_id) });
  };

  const closeDialogs = () => {
    setCreateOpen(false);
    setEditingBus(null);
    reset();
  };

  const submitCreate = async (form: BusForm) => {
    const payload: CreateBusPayload = {
      name: form.name.trim(),
      line_id: Number(form.line_id),
    };
    try {
      await createBus(payload);
      toast.success(t("busesPage.busCreated", { name: payload.name }));
      closeDialogs();
    } catch (err: any) {
      toast.warning(t(err.message ?? err));
    }
  };

  const submitEdit = async (form: BusForm) => {
    if (!editingBus) return;
    try {
      await updateBus({
        id: editingBus.id,
        payload: { name: form.name.trim(), line_id: Number(form.line_id) },
      });
      toast.success(t("busesPage.busUpdated", { name: form.name.trim() }));
      closeDialogs();
    } catch (err: any) {
      toast.warning(t(err.message ?? err));
    }
  };

  const confirmDelete = async () => {
    if (!deletingBus) return;
    try {
      await deleteBus(deletingBus.id);
      toast.success(t("busesPage.busDeleted", { name: deletingBus.name }));
      setDeletingBus(null);
    } catch (err: any) {
      toast.warning(t(err.message ?? err));
    }
  };

  const columns: ColumnDef<Bus>[] = [
    {
      accessorKey: "name",
      header: t("busesPage.busName"),
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 font-medium">
          <BusFront className="size-5 text-primary" />
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "line_name",
      header: t("busesPage.line"),
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-lg font-medium text-primary">
          <RouteIcon className="size-5" />
          {row.original.line_name ?? lineNameForId(row.original.line_id)}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("admin.action"),
      cell: ({ row }) => {
        const bus = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-lg"
              onClick={() => openEdit(bus)}
            >
              <Pencil className="!size-4" />
              {t("admin.edit")}
            </Button>
            <Button
              variant="destructive"
              className="text-lg"
              onClick={() => setDeletingBus(bus)}
            >
              <Trash2 className="!size-4" />
              {t("admin.delete")}
            </Button>
          </div>
        );
      },
    },
  ];

  const noLines = !lines || lines.length === 0;

  const busFormFields = (
    <>
      <Controller
        name="name"
        control={control}
        rules={{
          required: t("errors.isRequired", {
            field: t("busesPage.busName"),
          }),
          minLength: {
            value: 2,
            message: t("errors.nameTooShort", { count: 2 }),
          },
        }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <Input
            value={field.value}
            onChange={field.onChange}
            type="text"
            label={t("busesPage.busName")}
            placeholder={t("busesPage.busNamePlaceholder")}
            errorText={fieldError?.message}
          />
        )}
      />

      <Controller
        name="line_id"
        control={control}
        rules={{
          required: t("errors.isRequired", { field: t("busesPage.line") }),
        }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <div>
            <label>{t("busesPage.line")}</label>
            <select
              value={field.value}
              onChange={field.onChange}
              className="h-16 w-full rounded-md border border-input bg-background px-3 py-1 text-foreground outline-none"
            >
              <option value="" disabled>
                {t("busesPage.linePlaceholder")}
              </option>
              {lines?.map((line) => (
                <option key={line.id} value={String(line.id)}>
                  {line.name}
                </option>
              ))}
            </select>
            {fieldError?.message && (
              <p className="text-destructive">{fieldError.message}</p>
            )}
          </div>
        )}
      />
    </>
  );

  if (isLoading) return <PageLoader />;

  return (
    <div className="grid gap-4 p-6">
      <div className="flex justify-end">
        <Button className="text-xl" onClick={openCreate} disabled={noLines}>
          <Plus className="!size-5" />
          {t("busesPage.createBus")}
        </Button>
      </div>

      {noLines && (
        <p className="text-lg text-muted-foreground">
          {t("busesPage.noLinesHint")}
        </p>
      )}

      <DataTable columns={columns} data={buses ?? []} />

      {/* Create bus dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (!open) closeDialogs();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("busesPage.createBus")}</DialogTitle>
            <DialogDescription>
              {t("busesPage.createBusSubtitle")}
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-5 text-xl"
            onSubmit={handleSubmit(submitCreate)}
          >
            {busFormFields}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="text-xl"
                onClick={closeDialogs}
              >
                {t("admin.cancel")}
              </Button>
              <Button type="submit" disabled={isCreating} className="text-xl">
                {t("admin.add")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit bus dialog */}
      <Dialog
        open={Boolean(editingBus)}
        onOpenChange={(open) => {
          if (!open) closeDialogs();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("busesPage.editBus")}</DialogTitle>
            <DialogDescription>{editingBus?.name}</DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-5 text-xl"
            onSubmit={handleSubmit(submitEdit)}
          >
            {busFormFields}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="text-xl"
                onClick={closeDialogs}
              >
                {t("admin.cancel")}
              </Button>
              <Button type="submit" disabled={isUpdating} className="text-xl">
                {t("profilePage.saveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deletingBus)}
        onOpenChange={(open) => {
          if (!open) setDeletingBus(null);
        }}
        title={t("busesPage.deleteBus")}
        description={t("busesPage.deleteBusConfirm", {
          name: deletingBus?.name,
        })}
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default BusesPage;
