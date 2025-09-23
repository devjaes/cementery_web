import ContainerApp from "@/core/layout/container-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CementeryForm } from "../components/cementery-form.component";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function CementeryCreateView() {
  return (
    <ContainerApp title="Nuevo Cementerio">
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
            <CardTitle className="text-2xl">Registrar Cementerio</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">Completa los datos para registrar un nuevo cementerio.</p>
          </CardHeader>
          <CardContent>
            <CementeryForm />
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
} 