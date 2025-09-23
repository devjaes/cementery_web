"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/sign-in");
    }
  }, [isLoading, session, router]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return session ? children : null;
}
