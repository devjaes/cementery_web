import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { CementeryEntity } from '@/features/cementery/domain/entities/cementery.entity';
import { useNichesWithHuecos, NichoWithHuecos } from '../hooks/use-niches-with-huecos';
import { EstadoVentaNicho } from '@/features/nichos/domain/entities/nicho.entity';
import { HuecoTooltip } from './hole-tooltip.component';
import { ColumnsSelector } from './column-selector';
import { CreatePaymentForm } from '@/features/payment';
import { ReservationActions } from '@/features/nichos/presentation/components/reservation-actions.component';

interface NichesGridProps {
  cemetery: CementeryEntity;
}

// Estados del nicho y sus colores
const estadosNicho: Record<EstadoVentaNicho, { color: string; hover: string; label: string }> = {
  'Disponible': { color: 'bg-green-400', hover: 'hover:bg-green-500', label: 'Disponible' },
  'Reservado': { color: 'bg-yellow-400', hover: 'hover:bg-yellow-500', label: 'Reservado' },
  'Vendido': { color: 'bg-red-500', hover: 'hover:bg-red-600', label: 'Vendido' }
};

  const getNicheColorByEstado = (nicho: NichoWithHuecos) => {
    const estado = (nicho.estadoVenta || 'Disponible') as EstadoVentaNicho;
  return estadosNicho[estado as keyof typeof estadosNicho] || estadosNicho['Disponible'];
};

export const NichesGrid: React.FC<NichesGridProps> = ({ cemetery }) => {
  const router = useRouter();
  const { niches, loading, error, refetch } = useNichesWithHuecos(cemetery.idCementerio);
  const [gridColumns, setGridColumns] = useState<number>(10);
  const [sellDialogOpen, setSellDialogOpen] = useState<boolean>(false);
  const [selectedForSale, setSelectedForSale] = useState<NichoWithHuecos | null>(null);
  // Estado para ver reserva sin depender del Tooltip
  const [viewReservationOpen, setViewReservationOpen] = useState<boolean>(false);
  const [reservationNichoId, setReservationNichoId] = useState<string | null>(null);

  const handleNicheClick = (nicheId: string) => {
    router.push(`/nichos/${nicheId}`);
  };

  const openSellDialog = (nicho: NichoWithHuecos) => {
    setSelectedForSale(nicho);
    setSellDialogOpen(true);
  };

  if (loading) return <div>Cargando nichos...</div>;
  if (error) return <div>{error}</div>;

  // Crear el estilo dinámico para las columnas del grid
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`
  };

  return (
    <div className="space-y-6">
      {/* Selector de columnas */}
      <ColumnsSelector
        columns={gridColumns}
        onChange={setGridColumns}
        maxColumns={20}
        minColumns={1}
      />

      {/* Leyenda de colores */}
      <div className="flex justify-center flex-wrap gap-4 mb-6">
        {Object.entries(estadosNicho).map(([estado, { color, label }]) => (
          <div key={estado} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${color}`}></div>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* Grid de nichos con columnas dinámicas */}
      <div
        className="grid gap-2 max-w-6xl mx-auto p-6 border rounded-lg bg-gray-50"
        style={gridStyle}
      >
        <TooltipProvider>
          {niches.map((niche) => {
            const colorStatus = getNicheColorByEstado(niche);
            return (
              <Tooltip key={niche.idNicho}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleNicheClick(niche.idNicho!)}
                    className={`
                      w-8 h-8 rounded border-2 border-white shadow-sm transition-all
                      ${colorStatus.color} ${colorStatus.hover}
                      text-white text-xs font-medium
                      transform hover:scale-110 hover:shadow-lg
                      cursor-pointer
                    `}
                  >
                    {niche.numero}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black">
                  <div className="text-center">
                    <p className="font-medium">Nicho {niche.numero}</p>
                    <p className="text-sm text-muted-foreground">
                      {colorStatus.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cementerio: {cemetery.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sector: {niche.sector} | Fila: {niche.fila}
                    </p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">
                      Haz clic para ver detalles
                    </p>
                  </div>
                  <HuecoTooltip nicho={niche} />
                  {(niche.estadoVenta === 'Disponible' || !niche.estadoVenta) && (
                    <div className="mt-3 flex justify-center">
                      <Button size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openSellDialog(niche); }}>
                        Vender
                      </Button>
                    </div>
                  )}
                  {niche.estadoVenta === 'Reservado' && (
                    <div className="mt-3 flex justify-center">
                      {/* Botón Ver Reserva en el mismo lugar que Vender */}
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setReservationNichoId(niche.idNicho!);
                          setViewReservationOpen(true);
                        }}
                      >
                        Ver Reserva
                      </Button>
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Información adicional del grid */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Mostrando {niches.length} nichos en {gridColumns} columnas
          {niches.length > 0 && (
            <> • {Math.ceil(niches.length / gridColumns)} filas</>
          )}
        </p>
      </div>

      {/* Modal de venta de nicho */}
      <Dialog open={sellDialogOpen} onOpenChange={(open) => { setSellDialogOpen(open); if (!open) setSelectedForSale(null); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedForSale ? `Vender Nicho ${selectedForSale.numero}` : 'Vender Nicho'}
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