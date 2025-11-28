"use client";

import ContainerApp from "@/core/layout/container-app";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const features = [
  {
    title: "Gestión de Cementerios",
    description: "Configura y administra los cementerios del municipio.",
    href: "/cementerio",
  },
  {
    title: "Propietarios y Herederos",
    description: "Gestiona las personas propietarias y herederas de nichos.",
    href: "/persons",
  },
  {
    title: "Gestión de Nichos y Huecos",
    description:
      "Administra los nichos y huecos del cementerio de forma eficiente.",
    href: "/nichos",
  },
  {
    title: "Mapa Interactivo del Cementerio",
    description: "Visualiza y navega el cementerio con los nichos creados.",
    href: "/map",
  },
  {
    title: "Inhumaciones",
    description: "Registra y consulta las inhumaciones.",
    href: "/requisitos-inhumacion",
  },
  {
    title: "Exhumaciones",
    description:
      "Gestiona las exhumaciones basadas en inhumaciones existentes.",
    href: "/exhumaciones",
    accent: "border-orange-500 bg-orange-50 hover:bg-orange-100",
  },
];

export default function MainPage() {
  const { user } = useCurrentUser();
  const userName = user?.nombre || "Usuario";

  return (
    <ContainerApp title="Dashboard">
      <div className="w-full max-w-7xl mx-auto py-8">
        <div className="mb-12 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            ¡Hola, {userName}!
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium">
            ¿Cómo podemos ayudarte hoy?
          </p>
          <p className="text-sm text-muted-foreground">
            Accede a las diferentes secciones del sistema para gestionar tu
            cementerio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            >
              <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ContainerApp>
  );
}
