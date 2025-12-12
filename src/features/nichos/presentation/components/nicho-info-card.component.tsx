import { NichoEntity } from "../../domain/entities/nicho.entity";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { DateFormatter } from "@/shared/lib/date-formatter";
import {
  Building2,
  Layers,
  Hash,
  Calendar,
  FileText,
  Grid3x3,
  ShoppingCart,
  Package,
} from "lucide-react";
import clsx from "clsx";

interface NichoInfoCardProps {
  nicho: NichoEntity;
}


export function NichoInfoCard({ nicho }: NichoInfoCardProps) {
  return (
    <Card>
      <CardContent>
        {/* Header */}
        <div className="pb-4 border-b mb-6">
          <h3 className="text-xl font-bold text-foreground">
            Detalle de Nicho
          </h3>
        </div>

        {/* Main Information - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem
            icon={<Building2 className="w-4 h-4" />}
            label="Cementerio"
            value={nicho.idCementerio?.nombre || "No especificado"}
          />
          <InfoItem
            icon={<Hash className="w-4 h-4" />}
            label="Fila"
            value={nicho.fila?.toString() || "No especificado"}
          />
          <InfoItem
            icon={<Hash className="w-4 h-4" />}
            label="Columna"
            value={nicho.columna?.toString() || "No especificado"}
          />
          <InfoItem
            icon={<Package className="w-4 h-4" />}
            label="Tipo"
            value={nicho.tipo}
          />
          <InfoItem
            icon={<ShoppingCart className="w-4 h-4" />}
            label="Estado de Venta"
            value={nicho.estadoVenta}
            badge={true}
            badgeVariant={
              nicho.estadoVenta === "Vendido"
                ? "destructive"
                : nicho.estadoVenta === "Reservado"
                ? "secondary"
                : "default"
            }
          />
          <InfoItem
            icon={<Grid3x3 className="w-4 h-4" />}
            label="Número de Huecos"
            value={nicho.numHuecos?.toString() || "0"}
          />
          <InfoItem
            icon={<Calendar className="w-4 h-4" />}
            label="Fecha de Adquisición"
            value={DateFormatter.toLocaleDateString(nicho.fechaConstruccion)}
          />
        </div>

        {/* Observaciones */}
        {nicho.observaciones && (
          <div className="mt-6 pt-6 border-t">
            <InfoItem
              icon={<FileText className="w-4 h-4" />}
              label="Observaciones"
              value={nicho.observaciones}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function InfoItem({
  icon,
  label,
  value,
  badge = false,
  badgeVariant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: boolean;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
          {label}
        </p>
        {badge ? (
          <Badge
            variant={badgeVariant}
            className={clsx(
              "w-fit",
              badgeVariant === "destructive" &&
                "bg-destructive/10 text-destructive",
              badgeVariant === "secondary" &&
                "bg-secondary/10 text-secondary-foreground",
              badgeVariant === "default" && "bg-primary/10 text-primary"
            )}
          >
            {value}
          </Badge>
        ) : (
          <p className="text-sm text-foreground break-words leading-relaxed">
            {value}
          </p>
        )}
      </div>
    </div>
  );
} 
