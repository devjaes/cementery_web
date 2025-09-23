"use client";
import ContainerApp from "@/core/layout/container-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CementeryForm } from "../components/cementery-form.component";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useFindCementeryByIdQuery } from "../hooks/use-cementery-queries";

export default function CementeryEditView({ cementeryId }: { cementeryId: string }) {
  const { data: cementery, isLoading } = useFindCementeryByIdQuery(cementeryId);

  return (
    <ContainerApp title="Editar Cementerio">
      <div className="min-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/cementerio">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a la lista
            </Button>
          </Link>
        </div>
        <Card className="p-2 md:p-8">
          <CardHeader>
            <CardTitle className="text-2xl">Editar Cementerio</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">Modifica los datos del cementerio y guarda los cambios.</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : cementery ? (
              <CementeryForm cementery={cementery} />
            ) : (
              <div className="text-center py-8 text-red-500">No se encontró el cementerio.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
} 