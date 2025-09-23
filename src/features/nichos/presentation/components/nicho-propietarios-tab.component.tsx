import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { NichoPropietariosList } from "../../../propietarios-nichos/presentation/components/nicho-propietarios-list.component";

interface NichoPropietariosTabProps {
  nichoId: string;
  onOpenPanel: () => void;
}

export function NichoPropietariosTab({ nichoId, onOpenPanel }: NichoPropietariosTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Propietarios del Nicho</CardTitle>
        <div className="flex justify-end mb-4">
          <Button className="gap-2" onClick={onOpenPanel}>
            <Plus className="w-4 h-4" /> Nuevo Propietario
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <NichoPropietariosList nichoId={nichoId} />
      </CardContent>
    </Card>
  );
} 