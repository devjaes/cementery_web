import { useState, useMemo, useEffect } from 'react';
import { useFindBloquesByCementeryQuery, useFindNichosByBloqueQuery } from '@/features/bloques/presentation/hooks/use-bloques-queries';
import { BloqueEntity } from '@/features/bloques/domain/entities/bloque.entity';
import { NichoEntity } from '@/features/nichos/domain/entities/nicho.entity';
import { useQueries } from '@tanstack/react-query';
import { BloqueRepositoryImpl } from '@/features/bloques/infrastructure/repositories/bloque.repository.impl';
import { BLOQUES_QUERY_KEYS } from '@/features/bloques/domain/constants/bloques-keys';

export interface BloqueWithNichos extends BloqueEntity {
  nichos: NichoEntity[];
  totalNichos: number;
  disponibles: number;
  reservados: number;
  vendidos: number;
}

export const useBloquesWithNichos = (idCementerio: string) => {
  const [selectedBloqueId, setSelectedBloqueId] = useState<string | null>(null);
  
  // Resetear selección cuando cambia el cementerio
  useEffect(() => {
    setSelectedBloqueId(null);
  }, [idCementerio]);
  
  const { data: bloques = [], isLoading: loadingBloques, error: errorBloques } = useFindBloquesByCementeryQuery(idCementerio);
  
  // Cargar nichos para TODOS los bloques en paralelo
  const bloquesNichosQueries = useQueries({
    queries: bloques.map((bloque) => ({
      queryKey: [...BLOQUES_QUERY_KEYS.byId(bloque.idBloque), 'nichos'],
      queryFn: () => BloqueRepositoryImpl.getInstance().findNichosByBloque(bloque.idBloque),
      enabled: !!bloque.idBloque,
      staleTime: 5 * 60 * 1000, // 5 minutos
    })),
  });

  // Query para obtener nichos del bloque seleccionado (con más frescura)
  const { data: bloqueWithNichosData, isLoading: loadingNichos, error: errorNichos } = useFindNichosByBloqueQuery(selectedBloqueId || '');

  // Convertir bloques con sus nichos y estadísticas reales
  const bloquesWithNichos: BloqueWithNichos[] = useMemo(() => {
    // Primero ordenar bloques por fecha de creación
    const sortedBloques = [...bloques].sort((a, b) => 
      new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime()
    );

    let nichoGlobalCounter = 1; // Contador global para todos los nichos

    return sortedBloques
      .map((bloque, index) => {
        const queryResult = bloquesNichosQueries[bloques.indexOf(bloque)];
        
        if (!queryResult.data) {
          return {
            ...bloque,
            nichos: [],
            totalNichos: 0,
            disponibles: 0,
            reservados: 0,
            vendidos: 0
          };
        }

        // Ordenar nichos por fila y columna: primero por fila, luego por columna
        const nichos = (queryResult.data.nichos as NichoEntity[])
          .sort((a, b) => {
            if (a.fila !== b.fila) {
              return a.fila - b.fila;
            }
            return a.columna - b.columna;
          })
          .map((nicho) => {
            // Asignar número global consecutivo
            const nichoWithNumber = {
              ...nicho,
              numeroGlobal: nichoGlobalCounter
            };
            nichoGlobalCounter++;
            return nichoWithNumber;
          });
        
        const disponibles = nichos.filter(n => n.estadoVenta === 'Disponible' || !n.estadoVenta).length;
        const reservados = nichos.filter(n => n.estadoVenta === 'Reservado').length;
        const vendidos = nichos.filter(n => n.estadoVenta === 'Vendido').length;

        return {
          ...bloque,
          nichos,
          totalNichos: queryResult.data.totalNichos,
          disponibles,
          reservados,
          vendidos
        };
      });
  }, [bloques, bloquesNichosQueries]);

  // Cuando hay un bloque seleccionado y se cargaron los nichos, crear el objeto completo
  const selectedBloque: BloqueWithNichos | null = useMemo(() => {
    if (!selectedBloqueId) return null;
    
    // Si ya tenemos los datos del bloque en bloquesWithNichos, usarlos
    const bloqueFromList = bloquesWithNichos.find(b => b.idBloque === selectedBloqueId);
    
    // Si tenemos datos frescos del query individual, usarlos
    if (bloqueWithNichosData) {
      // Calcular el offset de numeración global para este bloque
      const bloqueIndex = bloquesWithNichos.findIndex(b => b.idBloque === selectedBloqueId);
      let nichoOffset = 1;
      for (let i = 0; i < bloqueIndex; i++) {
        nichoOffset += bloquesWithNichos[i].totalNichos;
      }

      // Ordenar nichos por fila y columna
      const nichos = (bloqueWithNichosData.nichos as NichoEntity[])
        .sort((a, b) => {
          if (a.fila !== b.fila) {
            return a.fila - b.fila;
          }
          return a.columna - b.columna;
        })
        .map((nicho, idx) => ({
          ...nicho,
          numeroGlobal: nichoOffset + idx
        }));
      
      const disponibles = nichos.filter(n => n.estadoVenta === 'Disponible' || !n.estadoVenta).length;
      const reservados = nichos.filter(n => n.estadoVenta === 'Reservado').length;
      const vendidos = nichos.filter(n => n.estadoVenta === 'Vendido').length;

      return {
        ...bloqueWithNichosData.bloque,
        nichos,
        totalNichos: bloqueWithNichosData.totalNichos,
        disponibles,
        reservados,
        vendidos
      };
    }
    
    return bloqueFromList || null;
  }, [selectedBloqueId, bloqueWithNichosData, bloquesWithNichos]);

  const selectBloque = (bloqueId: string) => {
    setSelectedBloqueId(bloqueId);
  };

  const deselectBloque = () => {
    setSelectedBloqueId(null);
  };

  const loading = loadingBloques || bloquesNichosQueries.some(q => q.isLoading) || (selectedBloqueId ? loadingNichos : false);
  const error = errorBloques || bloquesNichosQueries.find(q => q.error)?.error || (selectedBloqueId ? errorNichos : null);

  return {
    bloques: bloquesWithNichos,
    selectedBloque,
    selectBloque,
    deselectBloque,
    loading,
    error
  };
};
