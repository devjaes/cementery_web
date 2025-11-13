import { useQuery } from "@tanstack/react-query";
import { BloqueRepositoryImpl } from "../../infrastructure/repositories/bloque.repository.impl";
import { BLOQUES_QUERY_KEYS } from "../../domain/constants/bloques-keys";
import { BloqueEntity } from "../../domain/entities/bloque.entity";

export const useFindBloquesByCementeryQuery = (idCementerio: string) => {
  return useQuery<BloqueEntity[]>({
    queryKey: BLOQUES_QUERY_KEYS.byCementery(idCementerio),
    queryFn: () => BloqueRepositoryImpl.getInstance().findByCementery(idCementerio),
    enabled: !!idCementerio,
  });
};

export const useFindBloqueByIdQuery = (id: string) => {
  return useQuery<BloqueEntity>({
    queryKey: BLOQUES_QUERY_KEYS.byId(id),
    queryFn: () => BloqueRepositoryImpl.getInstance().findById(id),
    enabled: !!id,
  });
};
