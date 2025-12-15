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
import { Input } from '@/shared/components/ui/input';
import { CementeryEntity } from '@/features/cementery/domain/entities/cementery.entity';
import { useBloquesWithNichos, BloqueWithNichos } from '../hooks/use-bloques-with-nichos';
import { NichoEntity } from '@/features/nichos/domain/entities/nicho.entity';
import { EstadoVentaNicho } from '@/features/nichos/domain/entities/nicho.entity';
import { HuecoTooltip } from './hole-tooltip.component';
import { CreatePaymentForm } from '@/features/payment';
import { ReservationActions } from '@/features/nichos/presentation/components/reservation-actions.component';
import { MausoleumReservationActions } from '@/features/nichos/presentation/components/mausoleum-reservation-actions.component';
import { EnableNichoForm } from '@/features/nichos/presentation/components/enable-nicho-form.component';
import { Loader2, AlertCircle, Grid3x3, Search, Box, Layers, ChevronLeft, Package, Hash, Eye, FileText, ShoppingCart, ArrowLeft, Power } from 'lucide-react';
import clsx from 'clsx';

interface BlocksWithNichesMapProps {
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

const getNicheColorByEstado = (nicho: NichoEntity) => {
  const estado = (nicho.estadoVenta || 'Disponible') as EstadoVentaNicho;
  return estadosNicho[estado as keyof typeof estadosNicho] || estadosNicho['Disponible'];
};

export const BlocksWithNichesMap: React.FC<BlocksWithNichesMapProps> = ({ cemetery, onStatisticsChange }) => {
  const router = useRouter();
  const { bloques, selectedBloque, selectBloque, deselectBloque, loading, error } = useBloquesWithNichos(cemetery.idCementerio);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sellDialogOpen, setSellDialogOpen] = useState<boolean>(false);
  const [selectedForSale, setSelectedForSale] = useState<NichoEntity | null>(null);
  const [viewReservationOpen, setViewReservationOpen] = useState<boolean>(false);
  const [reservationNichoId, setReservationNichoId] = useState<string | null>(null);
  const [enableDialogOpen, setEnableDialogOpen] = useState<boolean>(false);
  const [selectedForEnable, setSelectedForEnable] = useState<string | null>(null);
  const [mausoleumDialogOpen, setMausoleumDialogOpen] = useState<boolean>(false);
  const [mausoleumActionsOpen, setMausoleumActionsOpen] = useState<boolean>(false);
  const prevStatisticsRef = useRef<string>('');
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const innerGridRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  const filteredBloques = useMemo(() => {
    if (!searchTerm.trim()) {
      return bloques;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return bloques.filter(bloque => 
      bloque.nombre.toLowerCase().includes(searchLower) ||
      bloque.numero?.toString().includes(searchLower) ||
      bloque.descripcion?.toLowerCase().includes(searchLower)
    );
  }, [bloques, searchTerm]);

  const bloquesNormales = useMemo(() => filteredBloques.filter(b => ((b.tipoBloque ?? '').toString().trim().toLowerCase() !== 'mausoleo')), [filteredBloques]);
  const mausoleos = useMemo(() => filteredBloques.filter(b => ((b.tipoBloque ?? '').toString().trim().toLowerCase() === 'mausoleo')), [filteredBloques]);

  const statistics = useMemo(() => {
    const allNichos = bloques.flatMap(b => b.nichos);
    const disponibles = allNichos.filter(n => n.estadoVenta === 'Disponible' || !n.estadoVenta).length;
    const reservados = allNichos.filter(n => n.estadoVenta === 'Reservado').length;
    const vendidos = allNichos.filter(n => n.estadoVenta === 'Vendido').length;
    const total = allNichos.length;

    return { disponibles, reservados, vendidos, total };
  }, [bloques]);

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

  // Calcular el siguiente nicho disponible para venta en orden
  const nextAvailableNichoForSale = useMemo(() => {
    if (!selectedBloque) return null;
    
    // Ordenar nichos por fecha de creación (el más antiguo primero)
    const sortedNichos = [...selectedBloque.nichos].sort((a, b) => {
      const dateA = new Date(a.fechaCreacion).getTime();
      const dateB = new Date(b.fechaCreacion).getTime();
      return dateA - dateB;
    });
    
    // Encontrar el primer nicho disponible
    const firstAvailable = sortedNichos.find(n => n.estadoVenta === 'Disponible' || !n.estadoVenta);
    return firstAvailable?.idNicho || null;
  }, [selectedBloque]);

  const openSellDialog = (nicho: NichoEntity) => {
    setSelectedForSale(nicho);
    setSellDialogOpen(true);
  };

  const openEnableDialog = (nichoId: string) => {
    setSelectedForEnable(nichoId);
    setEnableDialogOpen(true);
  };

  const getBlockColor = (bloque: BloqueWithNichos) => {
    const tipo = (bloque.tipoBloque ?? '').toString().trim().toLowerCase();
    if (tipo === 'mausoleo') {
      if (bloque.estado === 'Activo') {
        return {
          bg: 'bg-violet-600',
          hover: 'hover:bg-violet-700',
          ring: 'ring-violet-500/20',
          badgeVariant: 'default' as const,
          bgLight: 'bg-violet-600/10',
          border: 'border-violet-500/20'
        };
      }
      return {
        bg: 'bg-violet-400',
        hover: 'hover:bg-violet-500',
        ring: 'ring-violet-500/20',
        badgeVariant: 'secondary' as const,
        bgLight: 'bg-violet-500/10',
        border: 'border-violet-500/20'
      };
    }

    if (bloque.estado === 'Activo') {
      return {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        ring: 'ring-blue-500/20',
        badgeVariant: 'default' as const,
        bgLight: 'bg-blue-500/10',
        border: 'border-blue-500/20'
      };
    }
    return {
      bg: 'bg-gray-400',
      hover: 'hover:bg-gray-500',
      ring: 'ring-gray-500/20',
      badgeVariant: 'secondary' as const,
      bgLight: 'bg-gray-500/10',
      border: 'border-gray-500/20'
    };
  };

  const handleZoomIn = () => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.3, +(z - 0.1).toFixed(2)));
  const handleFitToWidth = () => {
    if (!innerGridRef.current || !gridContainerRef.current || !selectedBloque) return;
    const cols = selectedBloque.numeroColumnas || 1;
    const nicheSizePx = getNicheSize(cols);
    const gap = 12;
    const totalGridWidth = cols * nicheSizePx + (cols - 1) * gap;
    const containerWidth = gridContainerRef.current.getBoundingClientRect().width - 32; // padding
    if (totalGridWidth <= 0) return;
    const fitZoom = Math.min(1, containerWidth / totalGridWidth);
    setZoom(Number(fitZoom.toFixed(2)));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando mapa del cementerio...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error al cargar los datos del cementerio</AlertDescription>
      </Alert>
    );
  }

  // Función utilitaria para calcular el tamaño del nicho según columnas
  const getNicheSize = (cols: number) => {
    if (cols > 40) return 28; // muy compacto
    if (cols > 30) return 32;
    if (cols > 25) return 36; // más de 25 columnas, reducir tamaño
    if (cols > 16) return 40;
    if (cols > 10) return 44;
    return 48; // default ~12 (3rem)
  };

  // Si hay un bloque seleccionado, mostrar la vista de nichos de ese bloque
  if (selectedBloque) {

    const nicheSize = getNicheSize(selectedBloque.numeroColumnas || 1);
    const isSelectedBloqueMausoleo = ((selectedBloque.tipoBloque ?? '').toString().trim().toLowerCase() === 'mausoleo') || ((selectedBloque.nombre ?? '').toString().trim().toLowerCase().includes('mausoleo'));
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deselectBloque}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a bloques
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5" />
                    {selectedBloque.nombre}
                  </CardTitle>
                  <CardDescription>
                    {selectedBloque.totalNichos} nicho{selectedBloque.totalNichos !== 1 ? 's' : ''} en este bloque
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
                  <CardContent className="p-2.5">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-emerald-700 leading-none mb-0.5">
                          Disponibles
                        </p>
                        <p className="text-lg font-bold text-emerald-700 leading-none">
                          {selectedBloque.disponibles}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 shadow-sm">
                  <CardContent className="p-2.5">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-amber-700 leading-none mb-0.5">
                          Reservados
                        </p>
                        <p className="text-lg font-bold text-amber-700 leading-none">
                          {selectedBloque.reservados}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-rose-200 bg-rose-50 shadow-sm">
                  <CardContent className="p-2.5">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-rose-700 leading-none mb-0.5">
                          Vendidos
                        </p>
                        <p className="text-lg font-bold text-rose-700 leading-none">
                          {selectedBloque.vendidos}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {isSelectedBloqueMausoleo && (
                <div className="flex items-center gap-2">
                  {/* Mostrar "Reservar Mausoleo" sólo si no hay reservas ni ventas en el bloque */}
                  {selectedBloque.reservados === 0 && selectedBloque.vendidos === 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setMausoleumDialogOpen(true)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Reservar Mausoleo
                    </Button>
                  )}

                  {/* Mostrar "Gestionar Reserva" sólo cuando el bloque tiene una reserva */}
                  {selectedBloque.reservados > 0 && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMausoleumActionsOpen(true)}
                      >
                        <FileText className="w-4 h-4" />
                        Gestionar Reserva
                      </Button>
                      <MausoleumReservationActions
                        bloqueId={selectedBloque.idBloque}
                        hideTrigger={true}
                        open={mausoleumActionsOpen}
                        onOpenChange={(v) => setMausoleumActionsOpen(v)}
                      />
                    </>
                  )}
                </div>
              )}

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={handleZoomOut}>-</Button>
                <div className="text-sm px-2">{Math.round(zoom * 100)}%</div>
                <Button size="sm" variant="ghost" onClick={handleZoomIn}>+</Button>
                <Button size="sm" variant="outline" onClick={handleFitToWidth}>Ajustar</Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {selectedBloque.totalNichos === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Grid3x3 className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No hay nichos en este bloque
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center flex-wrap gap-3">
                  {Object.entries(estadosNicho).map(([estado, { color, label }]) => (
                    <Badge key={estado} variant="outline" className="gap-2 px-3 py-1.5">
                      <div className={`w-3 h-3 rounded-full ${color}`}></div>
                      <span>{label}</span>
                    </Badge>
                  ))}
                </div>

                    {selectedBloque.disponibles > 0 && !isSelectedBloqueMausoleo && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Venta en orden:</strong> Solo puedes vender el siguiente nicho disponible (marcado con 
                      <span className="inline-flex items-center mx-1">
                        <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500"></span>
                      </span>
                      ). Los demás nichos se habilitarán automáticamente cuando se vendan los anteriores.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="p-2">
                  <div ref={gridContainerRef} className="overflow-auto border rounded-lg bg-muted/30 p-4">
                    <div
                      ref={innerGridRef}
                      className="grid"
                      style={{
                        gridTemplateColumns: `repeat(${selectedBloque.numeroColumnas}, ${nicheSize}px)`,
                        gap: 12,
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left',
                        width: `${selectedBloque.numeroColumnas * nicheSize + (selectedBloque.numeroColumnas - 1) * 12}px`,
                      }}
                    >
                  <TooltipProvider>
                    {selectedBloque.nichos.map((niche) => {
                      const colorStatus = getNicheColorByEstado(niche);
                      const isNextForSale = !isSelectedBloqueMausoleo && nextAvailableNichoForSale === niche.idNicho;
                      const isDisabled = niche.estadoVenta === 'Deshabilitado';
                      const nichoNumber = (niche as any).numeroGlobal || niche.columna;
                      return (
                        <Tooltip key={niche.idNicho}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => !isDisabled && handleNicheClick(niche.idNicho!)}
                              disabled={isDisabled || isSelectedBloqueMausoleo}
                              style={{ width: nicheSize, height: nicheSize }}
                              className={clsx(
                                'relative rounded-md font-semibold text-white',
                                'transition-all duration-200 ease-in-out',
                                !isDisabled && 'hover:scale-105 hover:shadow-lg hover:z-10',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                colorStatus.color,
                                !isDisabled && colorStatus.hover,
                                !isDisabled && `focus-visible:${colorStatus.ring}`,
                                isNextForSale && 'ring-2 ring-yellow-400 ring-offset-2 animate-pulse',
                                isDisabled && 'cursor-not-allowed opacity-60',
                                isSelectedBloqueMausoleo && 'cursor-not-allowed opacity-80'
                              )}
                            >
                              {isNextForSale && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                </span>
                              )}
                              <span className={clsx('inline-block', nicheSize <= 32 ? 'text-[10px]' : 'text-xs')}>{nichoNumber}</span>
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
                                <p className="font-bold text-base text-foreground">Nicho {nichoNumber}</p>
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

                              <div className="flex gap-2 pt-2 border-t flex-col">
                                {(niche.estadoVenta === 'Disponible' || !niche.estadoVenta) && (
                                  <>
                                    {isSelectedBloqueMausoleo ? (
                                      <div className="text-center text-sm text-muted-foreground">
                                        <p>Este nicho forma parte de un mausoleo. Las ventas se realizan por el bloque completo.</p>
                                        <div className="pt-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-black"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNicheClick(niche.idNicho!); }}
                                          >
                                            Detalles
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        {nextAvailableNichoForSale !== niche.idNicho && (
                                          <p className="text-[10px] text-amber-600 text-center">
                                            ⚠️ Debe venderse en orden
                                          </p>
                                        )}
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            className="flex-1"
                                            disabled={nextAvailableNichoForSale !== niche.idNicho}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              openSellDialog(niche);
                                            }}
                                          >
                                            Vender
                                          </Button>
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
                                      </>
                                    )}
                                  </>
                                )}
                                {niche.estadoVenta === 'Reservado' && (
                                  !isSelectedBloqueMausoleo ? (
                                    <div className="flex gap-2">
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
                                  ) : (
                                    <div className="text-center text-sm text-muted-foreground">
                                      <p>Este nicho forma parte de un mausoleo. Las gestiones de reserva se realizan por el bloque completo.</p>
                                      <div className="pt-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="w-full text-black"
                                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNicheClick(niche.idNicho!); }}
                                        >
                                          Detalles
                                        </Button>
                                      </div>
                                    </div>
                                  )
                                )}
                                {niche.estadoVenta === 'Vendido' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-black"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleNicheClick(niche.idNicho!);
                                    }}
                                  >
                                    Detalles
                                  </Button>
                                )}
                                {niche.estadoVenta === 'Deshabilitado' && (
                                  <Button
                                    size="sm"
                                    className="w-full gap-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      openEnableDialog(niche.idNicho!);
                                    }}
                                  >
                                    <Power className="w-4 h-4" />
                                    Habilitar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                  <p>
                    {selectedBloque.totalNichos} nicho{selectedBloque.totalNichos !== 1 ? 's' : ''} en {selectedBloque.numeroColumnas} columna{selectedBloque.numeroColumnas !== 1 ? 's' : ''}
                    {selectedBloque.totalNichos > 0 && (
                      <> × {selectedBloque.numeroFilas} fila{selectedBloque.numeroFilas !== 1 ? 's' : ''}</>
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal de venta de nicho */}
        <Dialog open={sellDialogOpen} onOpenChange={(open) => { setSellDialogOpen(open); if (!open) setSelectedForSale(null); }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedForSale ? `Vender Nicho ${(selectedForSale as any).numeroGlobal || selectedForSale.columna}` : 'Vender Nicho'}
              </DialogTitle>
            </DialogHeader>

            {selectedForSale && (
              <CreatePaymentForm
                procedureType="niche_sale"
                procedureId={selectedForSale.idNicho!}
                onSuccess={() => {
                  setSellDialogOpen(false);
                  setSelectedForSale(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de Ver Reserva */}
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
              setViewReservationOpen(false);
              setReservationNichoId(null);
              router.push(`/nichos/${reservationNichoId}?openPropietarios=true&personId=${buyerPersonId || ''}&paymentId=${paymentId || ''}`);
            }}
          />
        )}

        {/* Modal de habilitar nicho */}
        <Dialog open={enableDialogOpen} onOpenChange={(open) => { setEnableDialogOpen(open); if (!open) setSelectedForEnable(null); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Power className="w-5 h-5" />
                Habilitar Nicho
              </DialogTitle>
            </DialogHeader>

            {selectedForEnable && (
              <EnableNichoForm
                nichoId={selectedForEnable}
                onSuccess={() => {
                  setEnableDialogOpen(false);
                  setSelectedForEnable(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
        {/* Dialog Reservar Mausoleo */}
        <Dialog open={mausoleumDialogOpen} onOpenChange={(open) => { setMausoleumDialogOpen(open); }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Reservar Mausoleo: {selectedBloque.nombre}</DialogTitle>
            </DialogHeader>

            <CreatePaymentForm
              procedureType="mausoleum_sale"
              procedureId={selectedBloque.idBloque}
              onSuccess={() => setMausoleumDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Vista de bloques
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Bloques del Cementerio
              </CardTitle>
              <CardDescription>
                {filteredBloques.length === bloques.length
                  ? `${bloques.length} bloque${bloques.length !== 1 ? 's' : ''} con ${statistics.total} nicho${statistics.total !== 1 ? 's' : ''} en total`
                  : `${filteredBloques.length} de ${bloques.length} bloque${bloques.length !== 1 ? 's' : ''}`
                }
              </CardDescription>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar bloques por nombre, número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {filteredBloques.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Box className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchTerm ? 'No se encontraron bloques' : 'No hay bloques disponibles'}
              </p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground mt-2">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              
              <TooltipProvider>
                {bloquesNormales.length > 0 && (
                  <>
                    <div className="col-span-full">
                      <p className="font-semibold">Bloques</p>
                    </div>
                    {bloquesNormales.map((bloque) => {
                      const colorStatus = getBlockColor(bloque);
                      return (
                        <Tooltip key={bloque.idBloque}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => selectBloque(bloque.idBloque)}
                              className={clsx(
                                'relative p-6 rounded-lg font-semibold text-white',
                                'transition-all duration-200 ease-in-out',
                                'hover:scale-105 hover:shadow-xl',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                'flex flex-col items-center justify-center gap-2 min-h-[140px]',
                                colorStatus.bg,
                                colorStatus.hover,
                                `focus-visible:${colorStatus.ring}`
                              )}
                            >
                              <Grid3x3 className="w-8 h-8" />
                              <span className="text-lg font-bold text-center">{bloque.nombre}</span>
                              <span className="text-xs opacity-90 text-center">
                                {bloque.totalNichos} nicho{bloque.totalNichos !== 1 ? 's' : ''}
                              </span>
                              <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
                                <span className="flex items-center gap-1">
                                  <Package className="w-3 h-3" />
                                  {bloque.disponibles}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {bloque.reservados}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ShoppingCart className="w-3 h-3" />
                                  {bloque.vendidos}
                                </span>
                              </div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className={clsx(
                              "max-w-sm p-0 overflow-hidden border-2",
                              colorStatus.border
                            )}
                          >
                            <div className={clsx("px-4 py-2", colorStatus.bgLight)}>
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-bold text-base text-foreground">
                                  {bloque.numero !== null && bloque.numero !== undefined ? `Bloque ${bloque.numero}` : bloque.nombre}
                                </p>
                                <Badge
                                  variant={colorStatus.badgeVariant}
                                  className={clsx(
                                    'font-semibold',
                                    bloque.estado === 'Activo' 
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'bg-gray-600 text-white hover:bg-gray-700'
                                  )}
                                >
                                  {bloque.estado}
                                </Badge>
                              </div>
                            </div>

                            <div className="p-4 space-y-3 bg-card">
                              <div className="space-y-2">
                                {bloque.numero !== null && bloque.numero !== undefined && (
                                  <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded bg-muted">
                                      <Box className="w-3.5 h-3.5 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                                        Número
                                      </p>
                                      <p className="text-sm font-semibold text-foreground leading-none">
                                        {bloque.numero}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded bg-muted">
                                    <Grid3x3 className="w-3.5 h-3.5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                                      Dimensiones
                                    </p>
                                    <p className="text-sm font-semibold text-foreground leading-none">
                                      {bloque.numeroFilas} filas × {bloque.numeroColumnas} columnas
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded bg-muted">
                                    <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                                      Nichos en bloque
                                    </p>
                                    <p className="text-sm font-semibold text-foreground leading-none">
                                      {bloque.totalNichos}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-2 border-t">
                                  <p className="text-[10px] text-muted-foreground leading-none mb-2">
                                    Estado de nichos
                                  </p>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                      <p className="text-xs font-semibold text-emerald-600">{bloque.disponibles}</p>
                                      <p className="text-[9px] text-muted-foreground">Disponibles</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs font-semibold text-amber-600">{bloque.reservados}</p>
                                      <p className="text-[9px] text-muted-foreground">Reservados</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs font-semibold text-rose-600">{bloque.vendidos}</p>
                                      <p className="text-[9px] text-muted-foreground">Vendidos</p>
                                    </div>
                                  </div>
                                </div>

                                {bloque.descripcion && (
                                  <div className="pt-2 border-t">
                                    <p className="text-[10px] text-muted-foreground leading-none mb-1">
                                      Descripción
                                    </p>
                                    <p className="text-xs text-foreground">
                                      {bloque.descripcion}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="pt-2 border-t">
                                <p className="text-[10px] text-muted-foreground">
                                  Haz clic para ver los nichos de este Bloque
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </>
                )}
                {mausoleos.length > 0 && (
                  <>
                    <div className="col-span-full">
                      <p className="font-semibold">Mausoleos</p>
                    </div>
                    {mausoleos.map((bloque) => {
                      const colorStatus = getBlockColor(bloque);
                      return (
                        <Tooltip key={bloque.idBloque}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => selectBloque(bloque.idBloque)}
                              className={clsx(
                                'relative p-6 rounded-lg font-semibold text-white',
                                'transition-all duration-200 ease-in-out',
                                'hover:scale-105 hover:shadow-xl',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                'flex flex-col items-center justify-center gap-2 min-h-[140px]',
                                colorStatus.bg,
                                colorStatus.hover,
                                `focus-visible:${colorStatus.ring}`
                              )}
                            >
                              <Grid3x3 className="w-8 h-8" />
                              <span className="text-lg font-bold text-center">{bloque.nombre}</span>
                              <span className="text-xs opacity-90 text-center">
                                {bloque.totalNichos} nicho{bloque.totalNichos !== 1 ? 's' : ''}
                              </span>
                              <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
                                <span className="flex items-center gap-1">
                                  <Package className="w-3 h-3" />
                                  {bloque.disponibles}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {bloque.reservados}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ShoppingCart className="w-3 h-3" />
                                  {bloque.vendidos}
                                </span>
                              </div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className={clsx(
                              "max-w-sm p-0 overflow-hidden border-2",
                              colorStatus.border
                            )}
                          >
                            <div className={clsx("px-4 py-2", colorStatus.bgLight)}>
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-bold text-base text-foreground">
                                  {bloque.numero !== null && bloque.numero !== undefined ? `Mausoleo ${bloque.numero}` : bloque.nombre}
                                </p>
                                <Badge
                                  variant={colorStatus.badgeVariant}
                                  className={clsx(
                                    'font-semibold',
                                    bloque.estado === 'Activo' 
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'bg-gray-600 text-white hover:bg-gray-700'
                                  )}
                                >
                                  {bloque.estado}
                                </Badge>
                              </div>
                            </div>

                            <div className="p-4 space-y-3 bg-card">
                              <div className="space-y-2">
                                {bloque.numero !== null && bloque.numero !== undefined && (
                                  <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded bg-muted">
                                      <Box className="w-3.5 h-3.5 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                                        Número
                                      </p>
                                      <p className="text-sm font-semibold text-foreground leading-none">
                                        {bloque.numero}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded bg-muted">
                                    <Grid3x3 className="w-3.5 h-3.5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                                      Dimensiones
                                    </p>
                                    <p className="text-sm font-semibold text-foreground leading-none">
                                      {bloque.numeroFilas} filas × {bloque.numeroColumnas} columnas
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded bg-muted">
                                    <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                                      Nichos en bloque
                                    </p>
                                    <p className="text-sm font-semibold text-foreground leading-none">
                                      {bloque.totalNichos}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-2 border-t">
                                  <p className="text-[10px] text-muted-foreground leading-none mb-2">
                                    Estado de nichos
                                  </p>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                      <p className="text-xs font-semibold text-emerald-600">{bloque.disponibles}</p>
                                      <p className="text-[9px] text-muted-foreground">Disponibles</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs font-semibold text-amber-600">{bloque.reservados}</p>
                                      <p className="text-[9px] text-muted-foreground">Reservados</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs font-semibold text-rose-600">{bloque.vendidos}</p>
                                      <p className="text-[9px] text-muted-foreground">Vendidos</p>
                                    </div>
                                  </div>
                                </div>

                                {bloque.descripcion && (
                                  <div className="pt-2 border-t">
                                    <p className="text-[10px] text-muted-foreground leading-none mb-1">
                                      Descripción
                                    </p>
                                    <p className="text-xs text-foreground">
                                      {bloque.descripcion}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="pt-2 border-t">
                                <p className="text-[10px] text-muted-foreground">
                                  Haz clic para ver los nichos de este Mausoleo
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </>
                )}
              </TooltipProvider>
            </div>
          )}

          {filteredBloques.length > 0 && (
            <div className="text-center text-sm text-muted-foreground pt-2 border-t">
              <p>
                {filteredBloques.length} bloque{filteredBloques.length !== 1 ? 's' : ''} mostrado{filteredBloques.length !== 1 ? 's' : ''}
                {searchTerm && ` (filtrado${filteredBloques.length !== 1 ? 's' : ''})`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
