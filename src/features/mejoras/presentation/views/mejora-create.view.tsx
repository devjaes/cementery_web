import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MejoraForm from "../components/mejora-form.component";

export default function MejoraCreateView() {
  return (
    <ContainerApp title="Nueva Solicitud de Mejoras">
      <div className="min-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/mejoras">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a la lista
            </Button>
          </Link>
        </div>
        <Card className="p-2 md:p-8">
          <CardContent>
            <MejoraForm />
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
}


