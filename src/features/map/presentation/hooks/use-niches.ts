import { NichoEntity } from '@/features/nichos/domain/entities/nicho.entity';
import { useFindAllNichosQuery } from '@/features/nichos/presentation/hooks/use-nicho-queries';
import { useState, useEffect } from 'react';

export const useNiches = () => {
    const [selectedNiche, setSelectedNiche] = useState<NichoEntity | null>(null);

    const {
        data: niches = [],
        isLoading: loading,
        error,
        refetch
    } = useFindAllNichosQuery();

    useEffect(() => {
        if (niches.length > 0 && !selectedNiche) {
            setSelectedNiche(niches[0]);
        }
    }, [niches, selectedNiche]);

    return {
        niches,
        selectedNiche,
        setSelectedNiche,
        loading,
        error: error ? 'Error al cargar los nichos' : null,
        refetch
    };
};