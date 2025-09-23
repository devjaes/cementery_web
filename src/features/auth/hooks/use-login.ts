"use client";

import { useMutation } from "@tanstack/react-query";
import { AuthRepositoryImp } from "../infrastructure/repositories/auth.repository.imp";
import { LoginRequest } from "../interfaces/user-auth.interface";
import { useAuthStore } from "../presentation/context/auth.store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useLogin() {
  const { setToken } = useAuthStore();
  const router = useRouter();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const authRepository = AuthRepositoryImp.getInstance();
      return await authRepository.signIn(data);
    },
    onSuccess: (data) => {
      setToken(data.access_token);
      toast.success("Inicio de sesión exitoso");
      router.replace("/main");
    },
    onError: () => toast.error("Error al iniciar sesión")
  });

  return { login, isPending };
}
