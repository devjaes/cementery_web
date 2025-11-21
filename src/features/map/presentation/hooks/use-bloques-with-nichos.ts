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
    return bloques
      .map((bloque, index) => {
        const queryResult = bloquesNichosQueries[index];
        
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

        // Ordenar nichos por fecha_creacion (más antiguos primero)
        const nichos = (queryResult.data.nichos as NichoEntity[])
          .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
        
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
      })
      // Ordenar bloques por fecha_creacion (más antiguos primero)
      .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
  }, [bloques, bloquesNichosQueries]);

  // Cuando hay un bloque seleccionado y se cargaron los nichos, crear el objeto completo
  const selectedBloque: BloqueWithNichos | null = useMemo(() => {
    if (!selectedBloqueId) return null;
    
    // Si ya tenemos los datos del bloque en bloquesWithNichos, usarlos
    const bloqueFromList = bloquesWithNichos.find(b => b.idBloque === selectedBloqueId);
    
    // Si tenemos datos frescos del query individual, usarlos
    if (bloqueWithNichosData) {
      // Ordenar nichos por fecha_creacion (más antiguos primero)
      const nichos = (bloqueWithNichosData.nichos as NichoEntity[])
        .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
      
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
