import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLogin } from "./use-login";
import {
  getDefaultValues,
  LoginSchema,
  loginSchema,
} from "../domain/schemas/login.schema";
import { signIn } from "next-auth/react";

export function useLoginForm() {
  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: getDefaultValues(),
  });

  const { login } = useLogin();

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    await signIn("credentials", {
      cedula: data.cedula,
      password: data.password,
      redirect: false,
    });
    login(data);
  };

  return { onSubmit, methods, isSubmitting: methods.formState.isSubmitting };
}
