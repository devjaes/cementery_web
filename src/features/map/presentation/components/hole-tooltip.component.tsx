import React from 'react';
import { NichoEntity } from '@/features/nichos/domain/entities/nicho.entity';

interface HuecoTooltipProps {
  nicho: NichoEntity;
}

export const HuecoTooltip: React.FC<HuecoTooltipProps> = ({ nicho }) => {
  const huecosOcupados = nicho.huecos?.filter(h => h.ocupado).length || 0;
  const huecosDisponibles = (nicho.numHuecos || 0) - huecosOcupados;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total de huecos:</span>
        <span className="font-semibold text-foreground">{nicho.numHuecos || 0}</span>
      </div>
      
      {nicho.numHuecos > 0 && (
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ocupados:</span>
            <span className="font-semibold text-rose-600">{huecosOcupados}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Disponibles:</span>
            <span className="font-semibold text-emerald-600">{huecosDisponibles}</span>
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-rose-500 h-full transition-all"
              style={{ width: `${(huecosOcupados / nicho.numHuecos) * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
};
