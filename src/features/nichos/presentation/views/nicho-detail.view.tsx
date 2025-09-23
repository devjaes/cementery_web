"use client";
import ContainerApp from "@/core/layout/container-app";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useFindNichoByIdQuery } from "../hooks/use-nicho-queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useState } from "react";
import { NichoInfoCard } from "../components/nicho-info-card.component";
import { NichoHuecosTab } from "../components/nicho-huecos-tab.component";
import { NichoPropietariosTab } from "../components/nicho-propietarios-tab.component";
import { PropietarioPanel } from "../components/propietario-panel.component";

interface NichoDetailViewProps {
  nichoId: string;
}

export default function NichoDetailView({ nichoId }: NichoDetailViewProps) {
  const { data: nicho, isLoading } = useFindNichoByIdQuery(nichoId);
  const [isPropietarioPanelOpen, setIsPropietarioPanelOpen] = useState(false);

  const handlePropietarioSuccess = () => {
    setIsPropietarioPanelOpen(false);
  };

  if (isLoading) {
    return (
      <ContainerApp title="Detalles del Nicho">
        <div className="text-center py-8">Cargando...</div>
      </ContainerApp>
    );
  }

  if (!nicho) {
    return (
      <ContainerApp title="Detalles del Nicho">
        <div className="text-center py-8 text-red-500">No se encontró el nicho.</div>
      </ContainerApp>
    );
  }

  return (
    <ContainerApp title={`Nicho ${nicho.sector}-${nicho.fila}-${nicho.numero}`}>
      <div className={"relative flex transition-all duration-300 " + (isPropietarioPanelOpen ? "pr-[420px]" : "pr-0")}>
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <Link href="/nichos">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver a la lista
              </Button>
            </Link>
          </div>

          <NichoInfoCard nicho={nicho} />

          <Tabs defaultValue="huecos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="huecos">Huecos</TabsTrigger>
              <TabsTrigger value="propietarios">Propietarios</TabsTrigger>
            </TabsList>
            <TabsContent value="huecos">
              <NichoHuecosTab nichoId={nichoId} />
            </TabsContent>
            <TabsContent value="propietarios">
              <NichoPropietariosTab 
                nichoId={nichoId} 
                onOpenPanel={() => setIsPropietarioPanelOpen(true)} 
              />
            </TabsContent>
          </Tabs>
        </div>

        <PropietarioPanel
          nichoId={nichoId}
          isOpen={isPropietarioPanelOpen}
          onClose={() => setIsPropietarioPanelOpen(false)}
          onSuccess={handlePropietarioSuccess}
        />
      </div>
    </ContainerApp>
  );
} 