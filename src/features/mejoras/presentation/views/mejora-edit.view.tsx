"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import MejoraFormEdit from "../components/mejora-form-edit.component";
import { useFindMejoraByIdQuery } from "../hooks/use-mejora-queries";
import { mapMejoraEntityToDTO } from "../helpers/mejora-entity-to-dto.mapper";

export default function MejoraEditView({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const searchTermParam = searchParams.get("q") ?? "";
  const { data, isLoading, isError, error } = useFindMejoraByIdQuery(id);
  
  const defaultValues = useMemo(() => {
    if (!data) {
      console.log("⏳ Esperando datos de la mejora...");
      return undefined;
    }
    console.log("📦 Datos recibidos de la API:", data);
    const mapped = mapMejoraEntityToDTO(data);
    console.log("✅ Valores mapeados para el formulario:", mapped);
    return mapped;
  }, [data]);

  const isApproved = data?.estado === "Aprobado";
  
  console.log("🎯 Estado de la vista de edición:", { id, isLoading, isError, hasData: !!data, defaultValues });

  if (isLoading) {
    return (
      <ContainerApp title="Editar Mejora">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Cargando información de la mejora...</p>
          </div>
        </div>
      </ContainerApp>
    );
  }

  if (isError || !data) {
    return (
      <ContainerApp title="Error">
        <div className="min-w-3xl mx-auto">
          <div className="mb-4">
            <Link href={searchTermParam ? `/mejoras?q=${encodeURIComponent(searchTermParam)}` : "/mejoras"}>
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver a la lista
              </Button>
            </Link>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No se pudo cargar la mejora</AlertTitle>
            <AlertDescription>
              {error instanceof Error 
                ? error.message 
                : "Ocurrió un error al intentar obtener los datos de la mejora. Por favor, verifica que el identificador sea correcto."}
            </AlertDescription>
          </Alert>
        </div>
      </ContainerApp>
    );
  }

  return (
    <ContainerApp title={`Editar Mejora - ${data.codigoAutorizacion ?? data.idMejora.slice(0, 8)}`}>
      <div className="min-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <Link href={searchTermParam ? `/mejoras?q=${encodeURIComponent(searchTermParam)}` : "/mejoras"}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a búsqueda
            </Button>
          </Link>
          
          {isApproved && (
            <div className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5">
              ⚠️ Esta mejora ya está aprobada
            </div>
          )}
        </div>
        
        {isApproved && (
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900">Advertencia</AlertTitle>
            <AlertDescription className="text-amber-800">
              Esta solicitud de mejora ya fue aprobada. Los cambios que realices se guardarán, 
              pero es recomendable contactar con el administrador antes de modificar información aprobada.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="p-2 md:p-8">
          <CardContent className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold">Información de la solicitud</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Modifica los campos necesarios y guarda los cambios. Todos los campos se cargarán con la información actual.
              </p>
            </div>
            
            <MejoraFormEdit
              mejoraId={id}
              defaultValues={defaultValues}
              isPrefillLoading={isLoading}
              searchTerm={searchTermParam}
            />
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
}
