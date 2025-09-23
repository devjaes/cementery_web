"use client";

import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { KeyRound } from "lucide-react";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import RHFPasswordInput from "@/shared/components/form/rhf/rhf-passwordInput";

const LoginForm = () => {
  const { methods, onSubmit, isSubmitting } = useLoginForm();

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="overflow-hidden border shadow-lg p-0">
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
            <KeyRound className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardHeader className="space-y-1 text-center pt-6 pb-2">
          <CardTitle className="text-2xl font-bold">
            Acceso al Sistema
          </CardTitle>
          <CardDescription className="text-base">
            Ingrese sus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <RHFInput
                name="cedula"
                label="Cédula"
                placeholder="Ingrese su número de cédula"
              />
              <RHFPasswordInput
                name="password"
                label="Contraseña"
                placeholder="Contraseña"
              />
              <div className="pt-2">
                <Button
                  className="w-full py-6 text-base font-medium"
                  size="lg"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Ingresando..." : "Ingresar"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline flex items-center"
          >
            Volver al inicio
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
