import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { InhumacionForm } from "../components/inhumacion-form.component";

export default function InhumacionCreateView() {
  return (
    <ContainerApp title="Nueva Inhumacion">
      <div className="min-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/inhumaciones">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a la lista
            </Button>
          </Link>
        </div>
        <Card className="p-2 md:p-8">
          <CardHeader>
            <CardTitle className="text-2xl">Registrar Inhumacion</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">Completa los datos para registrar una nueva inhumacion.</p>
          </CardHeader>
          <CardContent>
            <InhumacionForm />
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
} 