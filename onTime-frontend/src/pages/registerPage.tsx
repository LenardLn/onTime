import { register } from "@/apis/auth.api";
import Container from "@/components/container/Container";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { t } from "i18next";
import { Controller, useForm } from "react-hook-form";
import "../css/AuthPage.css";
import type { Credentials } from "@/entities/credentials";

const RegisterPage = () => {
  const { handleSubmit, control, watch } = useForm<Credentials>();

  const submitData = async (credentials: Credentials) => {
    console.log(credentials);
    try {
      const response = await register(credentials);

      console.log(response);
    } catch (error) {}
  };

  const samePasswordField = watch("password");

  return (
    <Container className="w-auto text-3xl">
      <form
        className="grid gap-6 bg-black-200 !bg-background"
        onSubmit={handleSubmit(submitData)}
      >
        <h1 className="h1">Register Admin</h1>
        <Controller
          name="email"
          control={control}
          rules={{
            required: t("errors.isRequired", {
              field: t("registerPage.email"),
            }),
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              value={field.value}
              onChange={field.onChange}
              type="email"
              label={t("registerPage.email")}
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
        <Button variant={"ghost"} className="text-2xl !px-[2rem] !py-[1rem]">
          {t("registerPage.register")}
        </Button>
      </form>
    </Container>
  );
};

export default RegisterPage;
