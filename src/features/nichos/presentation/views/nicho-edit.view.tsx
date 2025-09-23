"use client";
import ContainerApp from "@/core/layout/container-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { NichoForm } from "../components/nicho-form.component";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useFindNichoByIdQuery } from "../hooks/use-nicho-queries";

export default function NichoEditView({ nichoId }: { nichoId: string }) {
  const { data: nicho, isLoading } = useFindNichoByIdQuery(nichoId);

  return (
    <ContainerApp title="Editar Nicho">
      <div className="min-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/nichos">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a la lista
            </Button>
          </Link>
        </div>
        <Card className="p-2 md:p-8">
          <CardHeader>
            <CardTitle className="text-2xl">Editar Nicho</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">Modifica los datos del nicho y guarda los cambios.</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : nicho ? (
              <NichoForm nicho={nicho} />
            ) : (
              <div className="text-center py-8 text-red-500">No se encontró el nicho.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
} 