"use client";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useFindAllMejorasQuery } from "../hooks/use-mejora-queries";

export default function MejoraListView() {
  const { data, isLoading } = useFindAllMejorasQuery();

  return (
    <ContainerApp title="Solicitudes de Mejoras">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Mejoras en Tumbas</h2>
          <p className="text-gray-600 mt-1">Registra y gestiona autorizaciones de arreglos, construcción y lápidas.</p>
        </div>
        <Link href="/mejoras/nuevo">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Nueva Solicitud
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-8">Cargando...</div>
      ) : (
        <div className="border rounded-lg p-6 bg-white">
          {data && data.length > 0 ? (
            <ul className="space-y-3">
              {data.map((m) => (
                <li key={m.idMejora} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{m.tipoServicio} - {m.solicitante?.nombres} {m.solicitante?.apellidos}</p>
                    <p className="text-sm text-gray-600">{m.idCementerio?.nombre} • {new Date(m.fechaSolicitud).toLocaleDateString()}</p>
                  </div>
                  <Link href={`/mejoras/${m.idMejora}`}>
                    <Button variant="outline">Ver</Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-600">No hay solicitudes registradas.</div>
          )}
        </div>
      )}
    </ContainerApp>
  );
}


