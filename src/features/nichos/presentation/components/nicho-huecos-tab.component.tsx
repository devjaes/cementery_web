import { CardContent } from "@/shared/components/ui/card";
import { NichoHuecosList } from "../../../huecos/presentation/components/nicho-huecos-list.component";

interface NichoHuecosTabProps {
  nichoId: string;
}

export function NichoHuecosTab({ nichoId }: NichoHuecosTabProps) {
  if (!nichoId) {
    return (
      <CardContent>
        <p className="text-muted-foreground">Selecciona un nicho para ver sus huecos.</p>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <NichoHuecosList nichoId={nichoId} />
    </CardContent>
  );
}