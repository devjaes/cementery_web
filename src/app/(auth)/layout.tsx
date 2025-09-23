import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import PublicProtectedRoute from "@/core/providers/public-protected-route-provider";

export default async function AuthLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <PublicProtectedRoute>
      <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
        <AspectRatio ratio={16 / 9}>
          <Image
            src="/municipio-pillaro.jpg"
            alt="Municipio de Píllaro"
            fill
            className="absolute inset-0 object-cover brightness-65 saturate-125"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-background/30" />

          <Link
            href="/"
            className="absolute left-4 top-4 sm:left-8 sm:top-6 z-20 flex items-center text-lg font-bold tracking-tight"
          >
            <div className="mr-2 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">P</span>
            </div>
            <span className="text-xl">Municipio de Píllaro</span>
          </Link>
          <div className="absolute bottom-6 left-8 z-20 max-w-md">
            <h2 className="text-2xl font-bold mb-2">
              Bienvenido al Sistema de Catastros
            </h2>
            <p className="text-muted-foreground">
              Acceda a los servicios digitales del Gobierno Autónomo
              Descentralizado Municipal de Píllaro
            </p>
          </div>
        </AspectRatio>
        <main className="container absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
          {children}
        </main>
      </div>
    </PublicProtectedRoute>
  );
}
