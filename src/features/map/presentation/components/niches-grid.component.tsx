import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { CementeryEntity } from '@/features/cementery/domain/entities/cementery.entity';
import { useNichesWithHuecos, NichoWithHuecos } from '../hooks/use-niches-with-huecos';
import { EstadoVentaNicho } from '@/features/nichos/domain/entities/nicho.entity';
import { HuecoTooltip } from './hole-tooltip.component';
import { ColumnsSelector } from './column-selector';
import { CreatePaymentForm } from '@/features/payment';
import { ReservationActions } from '@/features/nichos/presentation/components/reservation-actions.component';
import { Loader2, AlertCircle, Layers, Hash, Package } from 'lucide-react';
import clsx from 'clsx';

interface NichesGridProps {
  cemetery: CementeryEntity;
  onStatisticsChange?: (statistics: { total: number; disponibles: number; reservados: number; vendidos: number }) => void;
}

const estadosNicho: Record<EstadoVentaNicho, {
  color: string;
  hover: string;
  ring: string;
  label: string;
  badgeVariant: 'default' | 'secondary' | 'destructive';
}> = {
  'Disponible': {
    color: 'bg-emerald-500',
    hover: 'hover:bg-emerald-600',
    ring: 'ring-emerald-500/20',
    label: 'Disponible',
    badgeVariant: 'default'
  },
  'Reservado': {
    color: 'bg-amber-500',
    hover: 'hover:bg-amber-600',
    ring: 'ring-amber-500/20',
    label: 'Reservado',
    badgeVariant: 'secondary'
  },
  'Vendido': {
    color: 'bg-rose-500',
    hover: 'hover:bg-rose-600',
    ring: 'ring-rose-500/20',
    label: 'Vendido',
    badgeVariant: 'destructive'
  },
  'Deshabilitado': {
    color: 'bg-gray-400',
    hover: 'hover:bg-gray-500',
    ring: 'ring-gray-400/20',
    label: 'Deshabilitado',
    badgeVariant: 'secondary'
  }
};

const getNicheColorByEstado = (nicho: NichoWithHuecos) => {
  const estado = (nicho.estadoVenta || 'Disponible') as EstadoVentaNicho;
  return estadosNicho[estado as keyof typeof estadosNicho] || estadosNicho['Disponible'];
};

export const NichesGrid: React.FC<NichesGridProps> = ({ cemetery, onStatisticsChange }) => {
  const router = useRouter();
  const { niches, loading, error, refetch } = useNichesWithHuecos(cemetery.idCementerio);
  const [gridColumns, setGridColumns] = useState<number>(10);
  const [sellDialogOpen, setSellDialogOpen] = useState<boolean>(false);
  const [selectedForSale, setSelectedForSale] = useState<NichoWithHuecos | null>(null);
  const [viewReservationOpen, setViewReservationOpen] = useState<boolean>(false);
  const [reservationNichoId, setReservationNichoId] = useState<string | null>(null);
  const prevStatisticsRef = useRef<string>('');

  const statistics = useMemo(() => {
    const disponibles = niches.filter(n => n.estadoVenta === 'Disponible' || !n.estadoVenta).length;
    const reservados = niches.filter(n => n.estadoVenta === 'Reservado').length;
    const vendidos = niches.filter(n => n.estadoVenta === 'Vendido').length;
    const total = niches.length;

    return { disponibles, reservados, vendidos, total };
  }, [niches]);

  useEffect(() => {
    const statsString = JSON.stringify(statistics);
    if (onStatisticsChange && statsString !== prevStatisticsRef.current) {
      prevStatisticsRef.current = statsString;
      onStatisticsChange(statistics);
    }
  }, [statistics, onStatisticsChange]);

  const handleNicheClick = (nicheId: string) => {
    router.push(`/nichos/${nicheId}`);
  };

  const openSellDialog = (nicho: NichoWithHuecos) => {
    setSelectedForSale(nicho);
    setSellDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando nichos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Crear el estilo dinámico para las columnas del grid
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mapa de Nichos</CardTitle>
              <CardDescription>
                {`Visualizaci\u00F3n visual de ${statistics.total} nichos`}
              </CardDescription>
            </div>
            <ColumnsSelector
              columns={gridColumns}
              onChange={setGridColumns}
              maxColumns={20}
              minColumns={1}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center flex-wrap gap-3">
            {Object.entries(estadosNicho).map(([estado, { color, label }]) => (
              <Badge key={estado} variant="outline" className="gap-2 px-3 py-1.5">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span>{label}</span>
              </Badge>
            ))}
          </div>

          <div
            className="grid gap-2 p-6 border rounded-lg bg-muted/30"
            style={gridStyle}
          >
            <TooltipProvider>
              {niches.map((niche) => {
                const colorStatus = getNicheColorByEstado(niche);
                const isDisabled = niche.estadoVenta === 'Deshabilitado';
                return (
                  <Tooltip key={niche.idNicho}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => !isDisabled && handleNicheClick(niche.idNicho!)}
                        disabled={isDisabled}
                        className={clsx(
                          'relative w-10 h-10 rounded-md font-semibold text-white text-xs',
                          'transition-all duration-200 ease-in-out',
                          !isDisabled && 'hover:scale-110 hover:shadow-lg hover:z-10',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                          colorStatus.color,
                          !isDisabled && colorStatus.hover,
                          !isDisabled && `focus-visible:${colorStatus.ring}`,
                          isDisabled && 'cursor-not-allowed opacity-60'
                        )}
                      >
                        {niche.columna}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className={clsx(
                        "max-w-sm p-0 overflow-hidden border-2",
                        colorStatus.badgeVariant === 'default' && 'border-emerald-500/20',
                        colorStatus.badgeVariant === 'secondary' && 'border-amber-500/20',
                        colorStatus.badgeVariant === 'destructive' && 'border-rose-500/20'
                      )}
                    >
                      <div className={clsx(
                        "px-4 py-2",
                        colorStatus.badgeVariant === 'default' && 'bg-emerald-500/10',
                        colorStatus.badgeVariant === 'secondary' && 'bg-amber-500/10',
                        colorStatus.badgeVariant === 'destructive' && 'bg-rose-500/10'
                      )}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-bold text-base text-foreground">Nicho {niche.columna}</p>
                          <Badge
                            variant={colorStatus.badgeVariant}
                            className={clsx(
                              'font-semibold',
                              colorStatus.badgeVariant === 'default' && 'bg-emerald-600 text-white hover:bg-emerald-700',
                              colorStatus.badgeVariant === 'secondary' && 'bg-amber-600 text-white hover:bg-amber-700',
                              colorStatus.badgeVariant === 'destructive' && 'bg-rose-600 text-white hover:bg-rose-700'
                            )}
                          >
                            {colorStatus.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 bg-card">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-muted">
                              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Fila</p>
                              <p className="text-sm font-semibold text-foreground leading-none">{niche.fila}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-muted">
                              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Columna</p>
                              <p className="text-sm font-semibold text-foreground leading-none">{niche.columna}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 col-span-2">
                            <div className="p-1.5 rounded bg-muted">
                              <Package className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Tipo</p>
                              <p className="text-sm font-semibold text-foreground leading-none">{niche.tipo}</p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-3">
                          <HuecoTooltip nicho={niche} />
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          {(niche.estadoVenta === 'Disponible' || !niche.estadoVenta) && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openSellDialog(niche);
                              }}
                            >
                              Vender
                            </Button>
                          )}
                          {niche.estadoVenta === 'Reservado' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="flex-1"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setReservationNichoId(niche.idNicho!);
                                setViewReservationOpen(true);
                              }}
                            >
                              Ver Reserva
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-black"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleNicheClick(niche.idNicho!);
                            }}
                          >
                            Detalles
                          </Button>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-2 border-t">
            <p>
              {statistics.total} nichos en {gridColumns} columnas
              {statistics.total > 0 && (
                <> - {Math.ceil(statistics.total / gridColumns)} filas</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de venta de nicho */}
      <Dialog open={sellDialogOpen} onOpenChange={(open) => { setSellDialogOpen(open); if (!open) setSelectedForSale(null); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedForSale ? `Vender Nicho ${selectedForSale.columna}` : 'Vender Nicho'}
            </DialogTitle>
          </DialogHeader>

          {selectedForSale && (
            <CreatePaymentForm
              procedureType="niche_sale"
              procedureId={selectedForSale.idNicho!}
              onSuccess={() => {
                setSellDialogOpen(false);
                setSelectedForSale(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Ver Reserva, fuera del Tooltip para evitar cierre al mover el mouse */}
      {reservationNichoId && (
        <ReservationActions
          nichoId={reservationNichoId}
          open={viewReservationOpen}
          onOpenChange={(open) => {
            setViewReservationOpen(open);
            if (!open) setReservationNichoId(null);
          }}
          hideTrigger
          onReceiptUploaded={(buyerPersonId, paymentId) => {
            // Al subir comprobante, cerrar diálogo y navegar al detalle del nicho con panel abierto
            setViewReservationOpen(false);
            setReservationNichoId(null);
            router.push(`/nichos/${reservationNichoId}?openPropietarios=true&personId=${buyerPersonId || ''}&paymentId=${paymentId || ''}`);
          }}
        />
      )}
    </div>
  );
};