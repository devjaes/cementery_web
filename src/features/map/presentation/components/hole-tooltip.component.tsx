import React from 'react';
import { NichoWithHuecos } from '../hooks/use-niches-with-huecos';
import { EstadoVentaNicho } from '@/features/nichos/domain/entities/nicho.entity';

interface HuecoTooltipProps {
  nicho: NichoWithHuecos;
}

export const HuecoTooltip: React.FC<HuecoTooltipProps> = ({ nicho }) => {
  const estado = (nicho.estadoVenta || 'Disponible') as EstadoVentaNicho;

  // Colores según el estado
  const getColor = (estado: EstadoVentaNicho) => {
    switch (estado) {
      case 'Vendido':
        return 'bg-red-500';
      case 'Reservado':
        return 'bg-yellow-400';
      case 'Disponible':
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="text-sm text-center space-y-1">
      <p className="font-semibold">Nicho {nicho.numero}</p>
      <p className="text-muted-foreground">Estado: {estado}</p>
      <div className={`w-full h-2 rounded ${getColor(estado)}`} />
      <div className="text-xs text-muted-foreground mt-2">
        <p>Sector: {nicho.sector}</p>
        <p>Fila: {nicho.fila}</p>
        <p>Número: {nicho.numero}</p>
        <p>Total Huecos: {nicho.numHuecos}</p>
      </div>
    </div>
  );
};
