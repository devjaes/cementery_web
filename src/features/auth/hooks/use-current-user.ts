"use client";

import { useAuthStore } from "../presentation/context/auth.store";
import { User } from "@/features/users/infraestructure/models/user.model";
import { useCemeteryStore } from "@/features/cementery/presentation/context/cemetery.store";
import { useRouter } from "next/navigation";

/**
 * Hook to access the currently logged in user
 * @returns The current user or null if there is no active session
 */
export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    user,
    isAuthenticated,
    isLoading: false, // State comes from store which is synchronous
  };
}

/**
 * Returns only the user without additional information
 * Useful when you only need to access user data
 */
export function useUser(): User | null {
  return useAuthStore((state) => state.user);
}

/**
 * Hook to verify authentication state and handle logout
 * Logout will clear both user session and selected cemetery
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authLogout = useAuthStore((state) => state.logout);
  const clearActiveCemetery = useCemeteryStore((state) => state.clearActiveCemetery);
  const router = useRouter();

  const logout = () => {
    authLogout();
    clearActiveCemetery();
    router.push("/sign-in");
  };

  return {
    user,
    token,
    isAuthenticated,
    logout,
  };
}

