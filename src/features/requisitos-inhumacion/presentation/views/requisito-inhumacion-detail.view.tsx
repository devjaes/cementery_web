
"use client";
import ContainerApp from "@/core/layout/container-app";
import { useFindRequisitoInhumacionByIdQuery } from "../hooks/use-requisito-inhumacion-queries";
import { RequisitoInhumacionCard } from "../components/requisito-inhumacion-card.component";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

interface RequisitoInhumacionViewProps{
    requisitoInhumacionId: string;
}


export default function RequisitoInhumacionDetailView({ requisitoInhumacionId }: RequisitoInhumacionViewProps) {

    const { data: requisitoInhumacion, isLoading } = useFindRequisitoInhumacionByIdQuery(requisitoInhumacionId);

     if (isLoading) {
        return (
          <ContainerApp title="Detalles del requisito de inhumación">
            <div className="text-center py-8">Cargando...</div>
          </ContainerApp>
        );
      }

       if (!requisitoInhumacion) {
          return (
            <ContainerApp title="Detalles del Requisito de Inhumación">
              <div className="text-center py-8 text-red-500">No se encontró el requisito.</div>
            </ContainerApp>
          );
        }


    return (
        <ContainerApp title={`Requisito de Inhumación - ${requisitoInhumacion?.idRequsitoInhumacion}`} >
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <Link href="/requisitos-inhumacion">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver a la lista
              </Button>
            </Link>
          </div>

            <RequisitoInhumacionCard requisitoInhumacion={requisitoInhumacion}  />
      </div>
        </ContainerApp>
    )
}