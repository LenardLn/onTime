import ConfirmDialog from "@/components/confirm-dialog/ConfirmDialog";
import { useAuthContext } from "@/components/contexts/authContext";
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
import { appPaths } from "@/entities/enums/appPaths";
import {
  UserRoles,
  type AdminUser,
  type UpdateUserPayload,
} from "@/entities/user";
import useDeleteUser from "@/hooks/admin/tanstack/useDeleteUser";
import useUpdateUser from "@/hooks/admin/tanstack/useUpdateUser";
import useUsers from "@/hooks/admin/tanstack/useUsers";
import useErrorMessage from "@/hooks/admin/useFetchSideEffects";
import type { ColumnDef } from "@tanstack/react-table";
import { BusFront, Pencil, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type EditUserForm = {
  email: string;
  role: AdminUser["roles"];
  password: string;
};

const UsersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuthContext();

  const { data: users, isLoading, isError, error } = useUsers();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const { handleSubmit, control, reset } = useForm<EditUserForm>({
    defaultValues: { email: "", role: UserRoles.ADMIN, password: "" },
  });

  useErrorMessage({ isError, error });

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    reset({ email: user.email, role: user.roles, password: "" });
  };

  const closeEdit = () => {
    setEditingUser(null);
    reset();
  };

  const submitEdit = async (form: EditUserForm) => {
    if (!editingUser) return;

    const payload: UpdateUserPayload = {
      email: form.email,
      role: form.role,
    };
    if (form.password) payload.password = form.password;

    try {
      await updateUser({ id: editingUser.id, payload });
      toast.success(t("usersPage.userUpdated", { email: form.email }));
      closeEdit();
    } catch (err: any) {
      toast.warning(t(err.message ?? err));
    }
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    try {
      await deleteUser(deletingUser.id);
      toast.success(t("usersPage.userDeleted", { email: deletingUser.email }));
      setDeletingUser(null);
    } catch (err: any) {
      toast.warning(t(err.message ?? err));
    }
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: "email",
      header: t("registerPage.email"),
    },
    {
      accessorKey: "roles",
      header: t("registerPage.userType"),
      cell: ({ row }) => {
        const isAdmin = row.original.roles === UserRoles.ADMIN;
        const Icon = isAdmin ? ShieldCheck : BusFront;
        return (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-lg font-medium ${
              isAdmin
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon className="size-5" />
            {isAdmin ? t("registerPage.admin") : t("registerPage.driver")}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("usersPage.createdAt"),
      cell: ({ row }) => row.original.created_at ?? "—",
    },
    {
      id: "actions",
      header: t("admin.action"),
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = String(user.id) === String(profile?.id);

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-lg"
              onClick={() => openEdit(user)}
            >
              <Pencil className="!size-4" />
              {t("admin.edit")}
            </Button>
            <Button
              variant="destructive"
              className="text-lg"
              disabled={isSelf}
              title={isSelf ? t("usersPage.cannotDeleteSelf") : undefined}
              onClick={() => setDeletingUser(user)}
            >
              <Trash2 className="!size-4" />
              {t("admin.delete")}
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="grid gap-4 p-6">
      <div className="flex justify-end">
        <Button
          className="text-xl"
          onClick={() => navigate(appPaths.adminRegister)}
        >
          <UserPlus className="!size-5" />
          {t("registerPage.createUser")}
        </Button>
      </div>

      <DataTable columns={columns} data={users ?? []} />

      {/* Edit user dialog */}
      <Dialog
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) closeEdit();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("usersPage.editUser")}</DialogTitle>
            <DialogDescription>{editingUser?.email}</DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-5 text-xl"
            onSubmit={handleSubmit(submitEdit)}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: t("errors.isRequired", {
                  field: t("registerPage.email"),
                }),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("errors.invalidEmail"),
                },
              }}
              render={({ field, fieldState: { error: fieldError } }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="email"
                  label={t("registerPage.email")}
                  errorText={fieldError?.message}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div>
                  <label>{t("registerPage.userType")}</label>
                  <select
                    value={field.value}
                    onChange={field.onChange}
                    className="h-16 w-full rounded-md border border-input bg-background px-3 py-1 text-foreground outline-none"
                  >
                    <option value={UserRoles.ADMIN}>
                      {t("registerPage.admin")}
                    </option>
                    <option value={UserRoles.DRIVER}>
                      {t("registerPage.driver")}
                    </option>
                  </select>
                </div>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                validate: (value) => {
                  if (value && value.length < 8) {
                    return t("errors.passwordTooShort", { count: 8 });
                  }
                },
              }}
              render={({ field, fieldState: { error: fieldError } }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="password"
                  label={t("usersPage.resetPassword")}
                  placeholder={t("usersPage.resetPasswordPlaceholder")}
                  errorText={fieldError?.message}
                />
              )}
            />

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
        open={Boolean(deletingUser)}
        onOpenChange={(open) => {
          if (!open) setDeletingUser(null);
        }}
        title={t("usersPage.deleteUser")}
        description={t("usersPage.deleteUserConfirm", {
          email: deletingUser?.email,
        })}
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default UsersPage;
