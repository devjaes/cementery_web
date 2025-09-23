import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { NichoHuecosList } from "../../../huecos/presentation/components/nicho-huecos-list.component";

interface NichoHuecosTabProps {
  nichoId: string;
}

export function NichoHuecosTab({ nichoId }: NichoHuecosTabProps) {

    return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Huecos del Nicho</CardTitle>
      </CardHeader>
      <CardContent>
        <NichoHuecosList nichoId={nichoId} />
      </CardContent>
    </Card>
  );
} 