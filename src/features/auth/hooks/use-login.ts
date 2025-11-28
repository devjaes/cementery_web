"use client";

import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { AuthRepositoryImp } from "../infrastructure/repositories/auth.repository.imp";
import { LoginRequest } from "../interfaces/user-auth.interface";
import { useAuthStore } from "../presentation/context/auth.store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useActiveCemetery } from "@/features/cementery/presentation/hooks/use-active-cemetery";
import { User } from "@/features/users/infraestructure/models/user.model";
import { UserRole } from "@/features/users/domain/enums/user-role.enum";

interface JwtPayload {
  user_id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  rol: string;
  iat: number;
  exp: number;
}

export function useLogin() {
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();
  const { activeCemetery } = useActiveCemetery();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const authRepository = AuthRepositoryImp.getInstance();
      return await authRepository.signIn(data);
    },
    onSuccess: (data) => {
      // Decode JWT to get user information
      const decoded = jwtDecode<JwtPayload>(data.access_token);

      // Create partial user object from JWT data
      const userFromToken: Partial<User> = {
        id_user: decoded.user_id,
        cedula: decoded.cedula,
        nombre: decoded.nombre,
        apellido: decoded.apellido,
        rol: decoded.rol as UserRole,
      };

      // Save token and user to store
      setToken(data.access_token);
      setUser(userFromToken as User);

      toast.success("Inicio de sesión exitoso");

      if (activeCemetery) {
        router.replace("/main");
      } else {
        router.replace("/cemetery-selector");
      }
    },
    onError: () => toast.error("Error al iniciar sesión"),
  });

  return { login, isPending };
}
