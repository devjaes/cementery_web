import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RequisitoInhumacionForm } from "../components/requisito-inhumacion-form.component";

export default function RequisitoInhumacionCreateView() {
  return (
    <ContainerApp title="Nuevo Requisito Inhumacion">
      <div className="min-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/requisitos-inhumacion">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a la lista
            </Button>
          </Link>
        </div>
        <Card className="p-2 md:p-8">
          {/* <CardHeader>
            <CardTitle className="text-2xl">Registrar Requisito Inhumacion</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">Completa los datos para registrar un neuvo requisito inhumacion.</p>
          </CardHeader> */}
          <CardContent>
            <RequisitoInhumacionForm />
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
}
