import { register } from "@/api/auth.api";
import Container from "@/components/container/container";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { t } from "i18next";
import { Controller, useForm } from "react-hook-form";

export type Credentials = {
    email: string,
    password: string,
    confirmPassword: string
}

const RegisterPage = () => {

    const { handleSubmit, control, watch } = useForm<Credentials>()

    const submitData = async (credentials: Credentials) => {
        try {
            const response = await register(credentials)

            console.log(response);
        } catch (error) {

        }
    }


    return (
        <Container className="w-auto">
            <form onSubmit={handleSubmit(submitData)}>
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: t("errors.isRequired", { field: t("registerPage.email") }),
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            value={field.value}
                            onChange={field.onChange}
                            type="email"
                            label={t("registerPage.email")}
                            helperText={error?.message}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: t("errors.isRequired", { field: t("registerPage.password") }),
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            value={field.value}
                            onChange={field.onChange}
                            type="password"
                            label={t("registerPage.password")}
                            helperText={error?.message}
                        />
                    )}
                />
                <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                        required: t("errors.isRequired", { field: t("registerPage.confirmPassword") }),
                        validate: (value) => {
                            if (value !== watch("password")) {
                                return t("errors.passwordsDoNotMatch")
                            }
                        }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            value={field.value}
                            onChange={field.onChange}
                            type="password"
                            label={t("registerPage.confirmPassword")}
                            helperText={error?.message}
                        />
                    )}
                />
                <Button>
                    {t("registerPage.register")}
                </Button>
            </form>
        </Container>
    )

};

export default RegisterPage;
