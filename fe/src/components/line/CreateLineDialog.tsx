import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import useCreateLine from "@/hooks/admin/tanstack/useCreateLine";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type LineForm = {
  name: string;
};

const CreateLineDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: createLine, isPending } = useCreateLine();

  const { handleSubmit, control, reset } = useForm<LineForm>({
    defaultValues: { name: "" },
  });

  const closeDialog = () => {
    setOpen(false);
    reset();
  };

  const submitLine = async ({ name }: LineForm) => {
    try {
      await createLine(name);
      toast.success(t("routesPage.lineCreated", { name }));
      closeDialog();
    } catch (error: any) {
      toast.warning(t(error.message ?? error));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => (isOpen ? setOpen(true) : closeDialog())}
    >
      <DialogTrigger asChild>
        <Button className="text-xl">
          <Plus className="!size-5" />
          {t("routesPage.createLine")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("routesPage.createLine")}</DialogTitle>
          <DialogDescription>
            {t("routesPage.createLineSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-5 text-xl"
          onSubmit={handleSubmit(submitLine)}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: t("errors.isRequired", {
                field: t("routesPage.lineName"),
              }),
              minLength: {
                value: 2,
                message: t("errors.nameTooShort", { count: 2 }),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                value={field.value}
                onChange={field.onChange}
                type="text"
                label={t("routesPage.lineName")}
                placeholder={t("routesPage.lineNamePlaceholder")}
                errorText={error?.message}
              />
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="text-xl"
              onClick={closeDialog}
            >
              {t("admin.cancel")}
            </Button>
            <Button type="submit" disabled={isPending} className="text-xl">
              {t("admin.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLineDialog;
