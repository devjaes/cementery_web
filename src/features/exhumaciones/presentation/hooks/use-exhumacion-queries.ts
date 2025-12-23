import { useQuery } from "@tanstack/react-query";
import { ExhumacionRepositoryImpl } from "../../infrastructure/repositories/exhumacion.repository.impl";
import { EXHUMACION_QUERY_KEYS } from "../../domain/constants/exhumacion-keys";

export const useFindAllExhumacionesQuery = () => {
  return useQuery({
    queryKey: EXHUMACION_QUERY_KEYS.all(),
    queryFn: () => ExhumacionRepositoryImpl.getInstance().findAll(),
  });
};

export const useFindExhumacionByIdQuery = (id: string) => {
  return useQuery({
    queryKey: EXHUMACION_QUERY_KEYS.byId(id),
    queryFn: () => ExhumacionRepositoryImpl.getInstance().findById(id),
    enabled: !!id,
  });
};

export const useFindExhumacionesByInhumacionQuery = (inhumacionId: string) => {
  return useQuery({
    queryKey: EXHUMACION_QUERY_KEYS.byInhumacion(inhumacionId),
    queryFn: () => ExhumacionRepositoryImpl.getInstance().findByInhumacionId(inhumacionId),
    enabled: !!inhumacionId,
  });
};

export const useFindExhumacionesByNichoQuery = (nichoId: string) => {
  return useQuery({
    queryKey: EXHUMACION_QUERY_KEYS.byNicho(nichoId),
    queryFn: () => ExhumacionRepositoryImpl.getInstance().findByNichoId(nichoId),
    enabled: !!nichoId,
  });
};
