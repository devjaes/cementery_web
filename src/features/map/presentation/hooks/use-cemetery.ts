import { CementeryEntity } from '@/features/cementery/domain/entities/cementery.entity';
import { useFindAllCementeriesQuery } from '@/features/cementery/presentation/hooks/use-cementery-queries';
import { useState, useEffect } from 'react';

export const useCemetery = () => {
    const [selectedCemetery, setSelectedCemetery] = useState<CementeryEntity | null>(null);
    
    const {
        data: cemeteries = [],
        isLoading: loading,
        error,
        refetch
    } = useFindAllCementeriesQuery();

    useEffect(() => {
        if (cemeteries.length > 0 && !selectedCemetery) {
            setSelectedCemetery(cemeteries[0]);
        }
    }, [cemeteries, selectedCemetery]);

    return {
        cemeteries,
        selectedCemetery,
        setSelectedCemetery,
        loading,
        error: error ? 'Error al cargar los cementerios' : null,
        refetch
    };
};