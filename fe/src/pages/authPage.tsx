import { login, me, register } from "@/apis/auth.api";
import { useAuthContext } from "@/components/contexts/authContext";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { appPaths } from "@/entities/enums/appPaths";
import { UserRoles, type UserRole } from "@/entities/user";
import { BusFront, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import "../css/AuthPage.css";
import type { Credentials } from "@/entities/credentials";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthPageProps {
  mode: "login" | "register";
}

const AuthPage = ({ mode }: AuthPageProps) => {
  const { t } = useTranslation();
  const { handleSubmit, control, watch, reset, formState } =
    useForm<Credentials>({
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
        role: UserRoles.ADMIN,
      },
    });
  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile } = useAuthContext();
  const isRegister = mode === "register";

  const submitData = async (credentials: Credentials) => {
    try {
      if (isRegister) {
        await register(credentials);
        toast.success(t("registerPage.userCreated"));
        reset();
      } else {
        await login(credentials);
        setIsAuthenticated(true);
        setProfile(await me());
        navigate(appPaths.adminDashboard);
      }
    } catch (error: any) {
      toast.warning(t(error.message ?? error));
    }
  };

  const samePasswordField = watch("password");

  const roleOptions: {
    value: UserRole;
    labelKey: string;
    descriptionKey: string;
    icon: typeof ShieldCheck;
  }[] = [
    {
      value: UserRoles.ADMIN,
      labelKey: "registerPage.admin",
      descriptionKey: "registerPage.adminDescription",
      icon: ShieldCheck,
    },
    {
      value: UserRoles.DRIVER,
      labelKey: "registerPage.driver",
      descriptionKey: "registerPage.driverDescription",
      icon: BusFront,
    },
  ];

  return (
    <div className="flex flex-1 items-center justify-center p-6 h-full">
      <div className="w-full max-w-2xl rounded-2xl border bg-card text-card-foreground shadow-lg p-10">
        <form className="grid gap-8" onSubmit={handleSubmit(submitData)}>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              {isRegister ? (
                <UserPlus className="size-8" />
              ) : (
                <LogIn className="size-8" />
              )}
            </div>
            <h1 className="text-4xl font-semibold">
              {isRegister ? t("registerPage.createUser") : t("homePage.login")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isRegister
                ? t("registerPage.createUserSubtitle")
                : t("registerPage.loginSubtitle")}
            </p>
          </div>

          {isRegister && (
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className="grid gap-3">
                  <label className="text-2xl">
                    {t("registerPage.userType")}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = field.value === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`flex flex-col items-start gap-2 rounded-xl border-2 p-5 text-left transition-all hover:cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-input hover:border-ring"
                          }`}
                        >
                          <div className="flex w-full items-center justify-between">
                            <Icon
                              className={`size-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <span
                              className={`size-5 rounded-full border-2 ${
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-input"
                              }`}
                            />
                          </div>
                          <span className="text-2xl font-medium">
                            {t(option.labelKey)}
                          </span>
                          <span className="text-lg text-muted-foreground">
                            {t(option.descriptionKey)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            />
          )}

          <div className="grid gap-6 text-2xl">
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
              render={({ field, fieldState: { error } }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="email"
                  label={t("registerPage.email")}
                  placeholder="name@ontime.app"
                  errorText={error?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: t("errors.isRequired", {
                  field: t("registerPage.password"),
                }),
                ...(isRegister && {
                  minLength: {
                    value: 8,
                    message: t("errors.passwordTooShort", { count: 8 }),
                  },
                }),
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="password"
                  label={t("registerPage.password")}
                  errorText={error?.message}
                />
              )}
            />
            {isRegister && (
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: t("errors.isRequired", {
                    field: t("registerPage.confirmPassword"),
                  }),
                  validate: (value) => {
                    if (value !== samePasswordField) {
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
            )}
          </div>

          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="text-2xl !px-[2rem] !py-[1rem]"
          >
            {isRegister ? t("registerPage.createUser") : t("homePage.login")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
