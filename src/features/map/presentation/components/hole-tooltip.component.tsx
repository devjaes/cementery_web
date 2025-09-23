import React from 'react';
import { NichoWithHuecos } from '../hooks/use-niches-with-huecos';
import { getColorByHuecoOcupado } from '@/shared/lib/get-hueco-color';

interface HuecoTooltipProps {
  nicho: NichoWithHuecos;
}

export const HuecoTooltip: React.FC<HuecoTooltipProps> = ({ nicho }) => {
  const ocupados = nicho.huecos?.filter(h => h.estado.toLowerCase() === 'ocupado').length || 0;
  const reservados = nicho.huecos?.filter(h => h.estado.toLowerCase() === 'reservado').length || 0;
  const total = nicho.huecos?.length || nicho.numHuecos || 0;
  const disponibles = Math.max(total - ocupados - reservados, 0);
  const { color } = getColorByHuecoOcupado(ocupados, reservados, total);

  const getEstadoDescripcion = () => {
    if (ocupados + reservados === 0) return 'Disponible';
    if (ocupados + reservados === total) return 'Lleno';
    return `Disponible (${disponibles}/${total})`;
  };

  return (
    <div className="text-sm text-center space-y-1">
      <p className="font-semibold">Nicho {nicho.numero}</p>
      <p className="text-muted-foreground">Estado: {getEstadoDescripcion()}</p>
      <div className={`w-full h-2 rounded ${color}`} />
      <div className="text-xs text-muted-foreground mt-2">
        <p>Huecos: {total}</p>
        <p>Ocupados: {ocupados}</p>
        <p>Reservados: {reservados}</p>
        <p>Disponibles: {disponibles}</p>
      </div>
    </div>
  );
};
