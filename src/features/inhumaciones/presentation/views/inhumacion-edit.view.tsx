"use client";
import ContainerApp from "@/core/layout/container-app";
import { useFindInhumacionByIdQuery } from "../hooks/use-inhumacion-queries";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { InhumacionForm } from "../components/inhumacion-form.component";

export default function InhumacionEditView({inhumacionId}: {inhumacionId: string;}) {



  const { data: inhumacion, isLoading } =  useFindInhumacionByIdQuery(inhumacionId);

  console.log("Inhumacion data:", inhumacion);
  
  return (
    <ContainerApp title="Editar Inhumación">
      <div className="min-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/inhumaciones">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a la lista
            </Button>
          </Link>
        </div>

        <Card className="p-2 md:p-8">
          <CardHeader>
            <CardTitle className="text-2xl">Editar Inhumacion</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Modifica los datos de la inhumacion y guarda los cambios.
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : inhumacion ? (
              <InhumacionForm inhumacion={inhumacion} />
            ) : (
              <div className="text-center py-8 text-red-500">
                No se encontró la inhumación.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
}
