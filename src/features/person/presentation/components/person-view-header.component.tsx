import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function PersonViewHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Gestión de Personas
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Busca y administra todas las personas registradas en el sistema
        </p>
      </div>
      <Link href="/persons/nuevo">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Persona
        </Button>
      </Link>
    </div>
  );
}
