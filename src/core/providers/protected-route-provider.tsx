"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useActiveCemetery } from "@/features/cementery/presentation/hooks/use-active-cemetery";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const router = useRouter();
  const pathname = usePathname();
  const { activeCemetery } = useActiveCemetery();

  useEffect(() => {
    // Esperar a que el store esté hidratado antes de redirigir
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    if (
      isAuthenticated &&
      !activeCemetery &&
      pathname !== "/cemetery-selector"
    ) {
      router.push("/cemetery-selector");
    }
  }, [isAuthenticated, isHydrated, activeCemetery, pathname, router]);

  // Mostrar loading mientras se hidrata el estado
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
