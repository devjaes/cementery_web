"use client";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFindMejoraByIdQuery } from "../hooks/use-mejora-queries";

export default function MejoraDetailView({ id }: { id: string }) {
  const { data, isLoading } = useFindMejoraByIdQuery(id);

  if (isLoading) return <ContainerApp title="Detalle de Mejora"><div className="py-8">Cargando...</div></ContainerApp>;
  if (!data) return <ContainerApp title="Detalle de Mejora"><div className="py-8">No encontrado</div></ContainerApp>;

  return (
    <ContainerApp title={`Mejora - ${data.codigoAutorizacion ?? data.idMejora}`}>
      <div className="mb-4">
        <Link href="/mejoras">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver a la lista
          </Button>
        </Link>
      </div>
      <div className="bg-white border rounded-lg p-6 space-y-2">
        <p><strong>Cementerio:</strong> {data.idCementerio?.nombre}</p>
        <p><strong>Panteonero:</strong> {data.pantoneroACargo}</p>
        <p><strong>Tipo de servicio:</strong> {data.tipoServicio}</p>
        <p><strong>Solicitante:</strong> {data.solicitante?.nombres} {data.solicitante?.apellidos}</p>
        <p><strong>Fecha solicitud:</strong> {new Date(data.fechaSolicitud).toLocaleDateString()}</p>
      </div>
    </ContainerApp>
  );
}


