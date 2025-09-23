import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PersonForm } from "../components/person-form.component";
import Link from "next/link";

export default function PersonCreateView() {
    return(
        <ContainerApp title="Nueva Persona">
      <div className="min-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/persons">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a la lista
            </Button>
          </Link>
        </div>
        <Card className="p-2 md:p-8">
          <CardHeader>
            <CardTitle className="text-2xl">Registrar Persona</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">Completa los datos para registrar una nueva persona.</p>
          </CardHeader>
          <CardContent>
            <PersonForm/>
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
    )
}