import { NichoEntity } from '@/features/nichos/domain/entities/nicho.entity';
import { HuecoEntity } from '@/features/huecos/domain/entities/hueco.entity';
import { useFindAllNichosQuery } from '@/features/nichos/presentation/hooks/use-nicho-queries';
import { useFindHuecosByCementerioQuery } from '@/features/huecos/presentation/hooks/use-hueco-queries';
import { useState, useEffect, useMemo } from 'react';

export interface NichoWithHuecos extends NichoEntity {
  huecos: HuecoEntity[];
}

export const useNichesWithHuecos = (cementerioId: string) => {
  const [selectedNiche, setSelectedNiche] = useState<NichoWithHuecos | null>(null);

  const {
    data: niches = [],
    isLoading: nichesLoading,
    error: nichesError,
    refetch: refetchNiches
  } = useFindAllNichosQuery();

  const {
    data: allHuecos = [],
    isLoading: huecosLoading,
    error: huecosError,
    refetch: refetchHuecos
  } = useFindHuecosByCementerioQuery(cementerioId);

  // Filtrar nichos del cementerio y mapear con sus huecos
  const nichesWithHuecos = useMemo(() => {
    const filteredNiches = niches.filter(
      (nicho: NichoEntity) => nicho.idCementerio?.idCementerio === cementerioId
    );

    return filteredNiches.map((nicho: NichoEntity): NichoWithHuecos => {
      // Filtrar huecos que pertenecen a este nicho
      const nichoHuecos = allHuecos.filter(
        (hueco: HuecoEntity) => hueco.idNicho?.idNicho === nicho.idNicho
      );

      return {
        ...nicho,
        huecos: nichoHuecos
      };
    });
  }, [niches, allHuecos, cementerioId]);

  useEffect(() => {
    if (nichesWithHuecos.length > 0 && !selectedNiche) {
      setSelectedNiche(nichesWithHuecos[0]);
    }
  }, [nichesWithHuecos, selectedNiche]);

  const refetch = () => {
    refetchNiches();
    refetchHuecos();
  };

  return {
    niches: nichesWithHuecos,
    selectedNiche,
    setSelectedNiche,
    loading: nichesLoading || huecosLoading,
    error: nichesError || huecosError ? 'Error al cargar los datos' : null,
    refetch
  };
};