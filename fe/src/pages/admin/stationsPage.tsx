import ConfirmDialog from "@/components/confirm-dialog/ConfirmDialog";
import { MapEditorProvider } from "@/components/contexts/mapEditorContext";
import { DataTable } from "@/components/data-table/DataTable";
import PageLoader from "@/components/loaders/PageLoader";
import BaseMap from "@/components/map/BaseMap";
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
import { BusStation } from "@/components/station/BusStation";
import type { Station } from "@/entities/route";
import useCreateStation from "@/hooks/admin/tanstack/useCreateStation";
import useDeleteStation from "@/hooks/admin/tanstack/useDeleteStation";
import useLines from "@/hooks/admin/tanstack/useLines";
import useStations from "@/hooks/admin/tanstack/useStations";
import useUpdateStation from "@/hooks/admin/tanstack/useUpdateStation";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";
import type { ColumnDef } from "@tanstack/react-table";
import { Marker, type MapLayerMouseEvent } from "@vis.gl/react-maplibre";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type StationForm = {
  name: string;
  line_id: string;
};

const StationsPage = () => {
  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useStations();
  const { data: lines } = useLines();
  const { mutateAsync: createStation, isPending: isCreating } =
    useCreateStation();
  const { mutateAsync: updateStation, isPending: isUpdating } =
    useUpdateStation();
  const { mutateAsync: deleteStation, isPending: isDeleting } =
    useDeleteStation();

  const [addOpen, setAddOpen] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [coordsError, setCoordsError] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [editCoords, setEditCoords] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [deletingStation, setDeletingStation] = useState<Station | null>(null);

  const { handleSubmit, control, reset } = useForm<StationForm>({
    defaultValues: { name: "", line_id: "" },
  });

  useErrorMessage({ isError, error });

  const lineName = (lineId?: number) =>
    lines?.find((line) => line.id === lineId)?.name ?? "—";

  const closeAdd = () => {
    setAddOpen(false);
    setPendingCoords(null);
    setCoordsError(false);
    reset();
  };

  const closeEdit = () => {
    setEditingStation(null);
    setEditCoords(null);
    reset();
  };

  const openEdit = (station: Station) => {
    setEditingStation(station);
    setEditCoords({ lat: station.lat, long: station.long });
    reset({ name: station.name, line_id: String(station.line_id ?? "") });
  };

  const handleMapClick = (e: MapLayerMouseEvent) => {
    const { lat, lng } = e.lngLat;
    setPendingCoords({ lat, long: lng });
    setCoordsError(false);
  };

  const submitCreate = async (form: StationForm) => {
    if (!pendingCoords) {
      setCoordsError(true);
      return;
    }

    try {
      await createStation({
        name: form.name,
        line_id: Number(form.line_id),
        lat: pendingCoords.lat,
        long: pendingCoords.long,
      });
      toast.success(t("stationsPage.stationCreated", { name: form.name }));
      closeAdd();
    } catch (err: any) {
      toast.warning(t(err.message ?? err));
    }
  };

  const submitEdit = async (form: StationForm) => {
    if (!editingStation) return;

    try {
      await updateStation({
        id: editingStation.id,
        payload: {
          name: form.name,
          line_id: Number(form.line_id),
          ...(editCoords && { lat: editCoords.lat, long: editCoords.long }),
        },
      });
      toast.success(t("stationsPage.stationUpdated", { name: form.name }));
      closeEdit();
    } catch (err: any) {
      toast.warning(t(err.message ?? err));
    }
  };

  const confirmDelete = async () => {
    if (!deletingStation) return;

    try {
      await deleteStation(deletingStation.id);
      toast.success(
        t("stationsPage.stationDeleted", { name: deletingStation.name }),
      );
      setDeletingStation(null);
    } catch (err: any) {
      toast.warning(t(err.message ?? err));
    }
  };

  const columns: ColumnDef<Station>[] = [
    {
      accessorKey: "name",
      header: t("stationsPage.stationName"),
    },
    {
      accessorKey: "line_id",
      header: t("stationsPage.line"),
      cell: ({ row }) => lineName(row.original.line_id),
    },
    {
      id: "coordinates",
      header: t("stationsPage.coordinates"),
      cell: ({ row }) =>
        `${row.original.lat.toFixed(5)}, ${row.original.long.toFixed(5)}`,
    },
    {
      id: "actions",
      header: t("admin.action"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-lg"
            onClick={() => openEdit(row.original)}
          >
            <Pencil className="!size-4" />
            {t("admin.edit")}
          </Button>
          <Button
            variant="destructive"
            className="text-lg"
            onClick={() => setDeletingStation(row.original)}
          >
            <Trash2 className="!size-4" />
            {t("admin.delete")}
          </Button>
        </div>
      ),
    },
  ];

  const lineSelectField = (
    <Controller
      name="line_id"
      control={control}
      rules={{
        required: t("errors.isRequired", { field: t("stationsPage.line") }),
      }}
      render={({ field, fieldState: { error: fieldError } }) => (
        <div>
          <label>{t("stationsPage.line")}</label>
          <select
            value={field.value}
            onChange={field.onChange}
            className={`h-16 w-full rounded-md border bg-background px-3 py-1 text-foreground outline-none ${
              fieldError ? "border-destructive" : "border-input"
            }`}
          >
            <option value="">{t("stationsPage.linePlaceholder")}</option>
            {lines?.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
          {fieldError && (
            <p className="text-destructive">{fieldError.message}</p>
          )}
        </div>
      )}
    />
  );

  const nameField = (
    <Controller
      name="name"
      control={control}
      rules={{
        required: t("errors.isRequired", {
          field: t("stationsPage.stationName"),
        }),
        minLength: {
          value: 3,
          message: t("errors.nameTooShort", { count: 3 }),
        },
      }}
      render={({ field, fieldState: { error: fieldError } }) => (
        <Input
          value={field.value}
          onChange={field.onChange}
          type="text"
          label={t("stationsPage.stationName")}
          placeholder={t("stationsPage.stationNamePlaceholder")}
          errorText={fieldError?.message}
        />
      )}
    />
  );

  if (isLoading) return <PageLoader />;

  return (
    <div className="grid gap-4 p-6">
      <div className="flex justify-end">
        <Button className="text-xl" onClick={() => setAddOpen(true)}>
          <Plus className="!size-5" />
          {t("stationsPage.createStation")}
        </Button>
      </div>

      <DataTable columns={columns} data={data?.stations ?? []} />

      {/* Add station: pick the spot on the map, then name it */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          if (!open) closeAdd();
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("stationsPage.createStation")}</DialogTitle>
            <DialogDescription>
              {pendingCoords
                ? `${pendingCoords.lat.toFixed(5)}, ${pendingCoords.long.toFixed(5)}`
                : t("stationsPage.mapHint")}
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-5 text-xl"
            onSubmit={handleSubmit(submitCreate)}
          >
            <div
              className={`h-[24rem] overflow-hidden rounded-xl border-2 ${
                coordsError ? "border-destructive" : "border-input"
              }`}
            >
              <MapEditorProvider>
                <BaseMap handleAddMarker={handleMapClick}>
                  {data?.stations.map((station) => (
                    <BusStation key={station.id} station={station} />
                  ))}
                  {pendingCoords && (
                    <Marker
                      latitude={pendingCoords.lat}
                      longitude={pendingCoords.long}
                      anchor="bottom"
                    >
                      <MapPin className="size-10 fill-primary/30 text-primary" />
                    </Marker>
                  )}
                </BaseMap>
              </MapEditorProvider>
            </div>
            {coordsError && (
              <p className="text-destructive text-lg -mt-3">
                {t("stationsPage.locationRequired")}
              </p>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              {nameField}
              {lineSelectField}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="text-xl"
                onClick={closeAdd}
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

      {/* Edit station */}
      <Dialog
        open={Boolean(editingStation)}
        onOpenChange={(open) => {
          if (!open) closeEdit();
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("stationsPage.editStation")}</DialogTitle>
            <DialogDescription>
              {t("stationsPage.dragHint")}
              {editCoords &&
                ` — ${editCoords.lat.toFixed(5)}, ${editCoords.long.toFixed(5)}`}
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-5 text-xl"
            onSubmit={handleSubmit(submitEdit)}
          >
            {editingStation && editCoords && (
              <div className="h-[24rem] overflow-hidden rounded-xl border-2 border-input">
                <MapEditorProvider>
                  <BaseMap
                    center={{
                      lat: editingStation.lat,
                      long: editingStation.long,
                      zoom: 15,
                    }}
                  >
                    <BusStation
                      station={{
                        ...editingStation,
                        lat: editCoords.lat,
                        long: editCoords.long,
                      }}
                      draggable
                      onDragEnd={(_station, { lat, lng }) =>
                        setEditCoords({ lat, long: lng })
                      }
                    />
                  </BaseMap>
                </MapEditorProvider>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              {nameField}
              {lineSelectField}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="text-xl"
                onClick={closeEdit}
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
        open={Boolean(deletingStation)}
        onOpenChange={(open) => {
          if (!open) setDeletingStation(null);
        }}
        title={t("stationsPage.deleteStation")}
        description={t("stationsPage.deleteStationConfirm", {
          name: deletingStation?.name,
        })}
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default StationsPage;
