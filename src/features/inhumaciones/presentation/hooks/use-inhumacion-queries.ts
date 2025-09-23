import { useQuery } from "@tanstack/react-query"
import { InhumacionEntity } from "../../domain/entities/inhumacion.entity"
import { INHUMACION_QUERY_KEYS } from "../../domain/constants/inhumacion-key"
import { InhumacionRepositoryImpl } from "../../infrastructure/repositories/inhumacion.repository.impl"


export const useFindAllInhumacionesQuery = () => {
    return useQuery<InhumacionEntity[]>({
        queryKey: INHUMACION_QUERY_KEYS.all(),
        queryFn: () => InhumacionRepositoryImpl.getInstance().findAll(),
    });
};

export const useFindInhumacionByIdQuery = (id: string) => { 
    return useQuery<InhumacionEntity>({
        queryKey: INHUMACION_QUERY_KEYS.byId(id),
        queryFn: () => InhumacionRepositoryImpl.getInstance().findById(id),
        enabled: !!id,
    })
}

export const useSearchInhumacionFallecidosQuery = (busqueda: string) => {
    return useQuery({
        queryKey: INHUMACION_QUERY_KEYS.searchFallecidos(busqueda),
        queryFn: () => InhumacionRepositoryImpl.getInstance().searchFallecidos(busqueda),
        enabled: !!busqueda && busqueda.trim().length >= 2,
    });
}