import { useQuery } from "@tanstack/react-query";
import { HuecoRepositoryImpl } from "../../infrastructure/repositories/hueco.repository.impl";
import { HUECO_QUERY_KEYS } from "../../domain/constants/hueco-keys";
import { HuecoEntity } from "../../domain/entities/hueco.entity";

export const useFindAllHuecosQuery = () => {
  return useQuery<HuecoEntity[]>({
    queryKey: HUECO_QUERY_KEYS.all(),
    queryFn: () => HuecoRepositoryImpl.getInstance().findAll(),
    
  });
}


export const useFindHuecosByNichoQuery = (nichoId: string) => {
  return useQuery<HuecoEntity[]>({
    queryKey: HUECO_QUERY_KEYS.byNicho(nichoId),
    queryFn: () => HuecoRepositoryImpl.getInstance().findByNicho(nichoId),
    enabled: !!nichoId,
  });
};

export const useFindHuecosByCementerioQuery = (cementerioId: string) => {
  return useQuery<HuecoEntity[]>({
    queryKey: HUECO_QUERY_KEYS.byCementerio(cementerioId),
    queryFn: () => HuecoRepositoryImpl.getInstance().findByCementerio(cementerioId),
    enabled: !!cementerioId,
  });
}
export const useFindHuecoByIdQuery = (id: string) => {
  return useQuery<HuecoEntity>({
    queryKey: HUECO_QUERY_KEYS.byId(id),
    queryFn: () => HuecoRepositoryImpl.getInstance().findById(id),
    enabled: !!id,
  });
};

export const useFindHuecosDisponiblesQuery = () => {
  return useQuery<HuecoEntity[]>({
    queryKey: [...HUECO_QUERY_KEYS.all(), "disponibles"],
    queryFn: () => HuecoRepositoryImpl.getInstance().findAllDisponibles(),
  });
}; 