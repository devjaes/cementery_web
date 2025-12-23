
"use client";
import ContainerApp from "@/core/layout/container-app";
import { useFindRequisitoInhumacionByIdQuery } from "../hooks/use-requisito-inhumacion-queries";
import { RequisitoInhumacionCard } from "../components/requisito-inhumacion-card.component";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";

interface RequisitoInhumacionViewProps{
    requisitoInhumacionId: string;
}


export default function RequisitoInhumacionDetailView({ requisitoInhumacionId }: RequisitoInhumacionViewProps) {

    const { data: requisitoInhumacion, isLoading } = useFindRequisitoInhumacionByIdQuery(requisitoInhumacionId);
  const [cedulaForBack, setCedulaForBack] = useState<string | null>(null);

    useEffect(() => {
      const loadCedula = async () => {
        try {
          const ced = requisitoInhumacion?.idFallecido?.cedula;
          if (ced) {
            setCedulaForBack(ced);
            return;
          }
          const idPersona = requisitoInhumacion?.idFallecido?.id_persona;
          if (!idPersona) return;
          const http = AxiosClient.getInstance();
          const resp = await http.get<any>(API_ROUTES.PERSONS.GET_BY_ID(idPersona));
          const cedula = resp?.data?.data?.cedula;
          if (cedula) setCedulaForBack(cedula);
        } catch (e) {
          // ignore, button will not be shown if cedula missing
          // eslint-disable-next-line no-console
          console.warn('No se pudo resolver cédula para botón volver a localización', e);
        }
      };
      loadCedula();
    }, [requisitoInhumacion]);

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
          <div className="mb-4 flex items-center gap-2">
            {/* Botón para volver a la localización del fallecido (usa la cédula si está disponible) */}
            { (requisitoInhumacion?.idFallecido?.cedula || cedulaForBack) && (
              <Link href={`/requisitos-inhumacion?q=${encodeURIComponent((requisitoInhumacion?.idFallecido?.cedula || cedulaForBack) as string)}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Volver a la Localización
                </Button>
              </Link>
            )}
          </div>

            <RequisitoInhumacionCard requisitoInhumacion={requisitoInhumacion}  />
      </div>
        </ContainerApp>
    )
}