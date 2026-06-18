import { logout, updateEmail, updatePassword } from "@/apis/auth.api";
import { useAuthContext } from "@/components/contexts/authContext";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Separator } from "@/components/shadcn/separator";
import { appPaths } from "@/entities/enums/appPaths";
import type {
  UpdateEmailPayload,
  UpdatePasswordPayload,
} from "@/entities/user";
import { KeyRound, LogOut, Mail, UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type PasswordForm = UpdatePasswordPayload & { confirm_password: string };

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, setProfile, setIsAuthenticated } = useAuthContext();

  const emailForm = useForm<UpdateEmailPayload>({
    defaultValues: { email: "", password: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const initials = profile?.email?.slice(0, 2).toUpperCase() ?? "??";

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setProfile(undefined);
      navigate("/");
    } catch (error: any) {
      toast.warning(t(error.message ?? error));
    }
  };

  const submitEmail = async (payload: UpdateEmailPayload) => {
    try {
      const updated = await updateEmail(payload);
      setProfile(updated);
      emailForm.reset();
      toast.success(t("profilePage.emailUpdated"));
    } catch (error: any) {
      toast.warning(t(error.message ?? error));
    }
  };

  const submitPassword = async ({
    current_password,
    new_password,
  }: PasswordForm) => {
    try {
      await updatePassword({ current_password, new_password });
      passwordForm.reset();
      toast.success(t("profilePage.passwordUpdated"));
    } catch (error: any) {
      toast.warning(t(error.message ?? error));
    }
  };

  const newPasswordField = passwordForm.watch("new_password");

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto grid w-full max-w-3xl gap-8">
        {/* Account overview */}
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-semibold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-3xl font-semibold">
                {profile?.email}
              </h1>
              <p className="mt-1 text-xl text-muted-foreground">
                {t("profilePage.signedInAs", {
                  role: profile?.roles ?? t("registerPage.admin"),
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="text-xl"
                onClick={() => navigate(appPaths.adminRegister)}
              >
                <UserPlus className="!size-5" />
                {t("registerPage.createUser")}
              </Button>
              <Button
                variant="destructive"
                className="text-xl"
                onClick={handleLogout}
              >
                <LogOut className="!size-5" />
                {t("admin.logout")}
              </Button>
            </div>
          </div>
        </div>

        {/* Change email */}
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                {t("profilePage.changeEmail")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("profilePage.changeEmailSubtitle")}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <form
            className="grid gap-5 text-xl"
            onSubmit={emailForm.handleSubmit(submitEmail)}
          >
            <Controller
              name="email"
              control={emailForm.control}
              rules={{
                required: t("errors.isRequired", {
                  field: t("profilePage.newEmail"),
                }),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("errors.invalidEmail"),
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="email"
                  label={t("profilePage.newEmail")}
                  placeholder={profile?.email}
                  errorText={error?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={emailForm.control}
              rules={{
                required: t("errors.isRequired", {
                  field: t("profilePage.currentPassword"),
                }),
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="password"
                  label={t("profilePage.currentPassword")}
                  errorText={error?.message}
                />
              )}
            />
            <Button
              type="submit"
              disabled={emailForm.formState.isSubmitting}
              className="justify-self-end text-xl"
            >
              {t("profilePage.saveChanges")}
            </Button>
          </form>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <KeyRound className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                {t("profilePage.changePassword")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("profilePage.changePasswordSubtitle")}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <form
            className="grid gap-5 text-xl"
            onSubmit={passwordForm.handleSubmit(submitPassword)}
          >
            <Controller
              name="current_password"
              control={passwordForm.control}
              rules={{
                required: t("errors.isRequired", {
                  field: t("profilePage.currentPassword"),
                }),
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="password"
                  label={t("profilePage.currentPassword")}
                  errorText={error?.message}
                />
              )}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                name="new_password"
                control={passwordForm.control}
                rules={{
                  required: t("errors.isRequired", {
                    field: t("profilePage.newPassword"),
                  }),
                  minLength: {
                    value: 8,
                    message: t("errors.passwordTooShort", { count: 8 }),
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    type="password"
                    label={t("profilePage.newPassword")}
                    errorText={error?.message}
                  />
                )}
              />
              <Controller
                name="confirm_password"
                control={passwordForm.control}
                rules={{
                  required: t("errors.isRequired", {
                    field: t("registerPage.confirmPassword"),
                  }),
                  validate: (value) => {
                    if (value !== newPasswordField) {
                      return t("errors.passwordsDoNotMatch");
                    }
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    type="password"
                    label={t("registerPage.confirmPassword")}
                    errorText={error?.message}
                  />
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="justify-self-end text-xl"
            >
              {t("profilePage.updatePassword")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
