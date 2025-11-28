import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLogin } from "./use-login";
import {
  getDefaultValues,
  LoginSchema,
  loginSchema,
} from "../domain/schemas/login.schema";

export function useLoginForm() {
  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: getDefaultValues(),
  });

  const { login } = useLogin();

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    login(data);
  };

  return { onSubmit, methods, isSubmitting: methods.formState.isSubmitting };
}
