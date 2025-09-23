import { useQuery } from "@tanstack/react-query";
import { CementeryRepositoryImpl } from "../../infrastructure/repositories/cementery.repository.impl";
import { CEMENTERY_QUERY_KEYS } from "../../domain/constants/cementery-keys";
import { CementeryEntity } from "../../domain/entities/cementery.entity";

export const useFindAllCementeriesQuery = () => {
    return useQuery<CementeryEntity[]>({
        queryKey: CEMENTERY_QUERY_KEYS.all(),
        queryFn: () => CementeryRepositoryImpl.getInstance().findAll(),
    });
};

export const useFindCementeryByIdQuery = (id: string) => {
    return useQuery<CementeryEntity>({
        queryKey: CEMENTERY_QUERY_KEYS.byId(id),
        queryFn: () => CementeryRepositoryImpl.getInstance().findById(id),
        enabled: !!id,
    });
};

export const useFindCementeryByNameQuery = (nombre: string) => {
    return useQuery<CementeryEntity>({
        queryKey: CEMENTERY_QUERY_KEYS.byName(nombre),
        queryFn: () => CementeryRepositoryImpl.getInstance().findByName(nombre),
        enabled: !!nombre,
    });
}; 