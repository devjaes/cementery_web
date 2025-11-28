import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Building2,
  Map,
  MapPin,
  Phone,
  User,
  Grid3x3,
  Package,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { useCemetery } from "../hooks/use-cemetery";
import { BlocksWithNichesMap } from "./blocks-with-niches-map.component";
import { useActiveCemetery } from "@/features/cementery/presentation/hooks/use-active-cemetery";

export const CemeteryMapVisualization: React.FC = () => {
  const { cemeteries, loading, error, refetch } = useCemetery();
  const { activeCemetery: selectedCemetery } = useActiveCemetery();

  const [statistics, setStatistics] = useState({
    total: 0,
    disponibles: 0,
    reservados: 0,
    vendidos: 0,
  });

  const handleStatisticsChange = useCallback(
    (stats: {
      total: number;
      disponibles: number;
      reservados: number;
      vendidos: number;
    }) => {
      setStatistics(stats);
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando cementerios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-destructive">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Visualización de Cementerios
              </CardTitle>
              <CardDescription>
                Selecciona un cementerio para ver y gestionar sus nichos
              </CardDescription>
            </div>
            {selectedCemetery && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">
                  {cemeteries.length} cementerio
                  {cemeteries.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedCemetery && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="py-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground whitespace-nowrap">
                        {selectedCemetery.nombre}
                      </h3>
                      <Badge
                        variant={
                          selectedCemetery.estado === "Activo"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          selectedCemetery.estado === "Activo"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {selectedCemetery.estado}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{selectedCemetery.direccion}</span>
                    </div>

                    {selectedCemetery.telefono && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{selectedCemetery.telefono}</span>
                      </div>
                    )}

                    {selectedCemetery.responsable && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{selectedCemetery.responsable}</span>
                      </div>
                    )}
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <Card className="border-border bg-card/50 shadow-sm w-[120px]">
                      <CardContent className="p-2.5">
                        <div className="flex items-center gap-2">
                          <Grid3x3 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-muted-foreground leading-none mb-0.5">
                              Total
                            </p>
                            <p className="text-lg font-bold text-foreground leading-none">
                              {statistics.total}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-emerald-200 bg-emerald-50 shadow-sm w-[120px]">
                      <CardContent className="p-2.5">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-emerald-700 leading-none mb-0.5">
                              Disponibles
                            </p>
                            <p className="text-lg font-bold text-emerald-700 leading-none">
                              {statistics.disponibles}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-amber-200 bg-amber-50 shadow-sm w-[120px]">
                      <CardContent className="p-2.5">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-amber-700 leading-none mb-0.5">
                              Reservados
                            </p>
                            <p className="text-lg font-bold text-amber-700 leading-none">
                              {statistics.reservados}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-rose-200 bg-rose-50 shadow-sm w-[120px]">
                      <CardContent className="p-2.5">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-rose-700 leading-none mb-0.5">
                              Vendidos
                            </p>
                            <p className="text-lg font-bold text-rose-700 leading-none">
                              {statistics.vendidos}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedCemetery && (
            <BlocksWithNichesMap
              key={selectedCemetery.idCementerio}
              cemetery={selectedCemetery}
              onStatisticsChange={handleStatisticsChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
