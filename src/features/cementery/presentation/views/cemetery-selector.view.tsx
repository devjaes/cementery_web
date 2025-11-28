"use client";

import { useRouter } from "next/navigation";
import { Building2Icon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useFindAllCementeriesQuery } from "../hooks/use-cementery-queries";
import { useActiveCemetery } from "../hooks/use-active-cemetery";
import { CementeryEntity } from "../../domain/entities/cementery.entity";

export function CemeterySelectorView() {
  const router = useRouter();
  const { data: cemeteries, isLoading } = useFindAllCementeriesQuery();
  const { setActiveCemetery } = useActiveCemetery();

  const handleSelectCemetery = (cemetery: CementeryEntity) => {
    setActiveCemetery(cemetery);
    router.push("/main");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Building2Icon className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Cargando cementerios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/30">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Selecciona un Cementerio
          </h1>
          <p className="text-muted-foreground">
            Elige el cementerio con el que deseas trabajar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cemeteries?.map((cemetery) => (
            <Card
              key={cemetery.idCementerio}
              className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
              onClick={() => handleSelectCemetery(cemetery)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2Icon className="h-5 w-5" />
                  {cemetery.nombre}
                </CardTitle>
                <CardDescription>
                  Haz clic para seleccionar este cementerio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{cemetery.direccion}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{cemetery.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="h-4 w-4" />
                  <span>{cemetery.responsable}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cemeteries && cemeteries.length === 0 && (
          <div className="text-center py-12">
            <Building2Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No hay cementerios disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
