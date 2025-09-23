import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { NichoEntity } from "../../domain/entities/nicho.entity";

interface NichoInfoCardProps {
  nicho: NichoEntity;
}

export function NichoInfoCard({ nicho }: NichoInfoCardProps) {
  return (
    <Card className="p-2 md:p-8 mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">Información del Nicho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Datos Básicos</h3>
            <div className="space-y-2">
              <p><span className="font-medium">ID:</span> {nicho.idNicho}</p>
              <p><span className="font-medium">Cementerio:</span> {nicho.idCementerio?.nombre}</p>
              <p><span className="font-medium">Sector:</span> {nicho.sector}</p>
              <p><span className="font-medium">Fila:</span> {nicho.fila}</p>
              <p><span className="font-medium">Número:</span> {nicho.numero}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Detalles Adicionales</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Tipo:</span> {nicho.tipo}</p>
              <p><span className="font-medium">Estado:</span> {nicho.estado}</p>
              <p><span className="font-medium">Número de Huecos:</span> {nicho.numHuecos}</p>
              <p><span className="font-medium">Fecha de Adquisición:</span> {new Date(nicho.fechaConstruccion).toLocaleDateString()}</p>
              {nicho.observaciones && (
                <p><span className="font-medium">Observaciones:</span> {nicho.observaciones}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 