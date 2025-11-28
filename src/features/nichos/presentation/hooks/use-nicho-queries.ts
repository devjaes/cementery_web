import { useQuery } from "@tanstack/react-query";
import { NichoRepositoryImpl } from "../../infrastructure/repositories/nicho.repository.impl";
import { NICHO_QUERY_KEYS } from "../../domain/constants/nicho-keys";
import {
  NichoEntity,
  NichoFallecidosEntity,
  SearchFallecidosEntity,
} from "../../domain/entities/nicho.entity";
import { NichoPropietariosResponse } from "../../domain/repositories/nicho.repository";
import { useCemeteryStore } from "@/features/cementery/presentation/context/cemetery.store";

export const useFindAllNichosQuery = () => {
  const currentCementerio = useCemeteryStore((state) => state.activeCemetery);
  return useQuery<NichoEntity[]>({
    queryKey: NICHO_QUERY_KEYS.all(currentCementerio?.idCementerio),
    queryFn: () =>
      NichoRepositoryImpl.getInstance().findAll(
        currentCementerio?.idCementerio
      ),
  });
};

export const useFindNichoByIdQuery = (id: string) => {
  return useQuery<NichoEntity>({
    queryKey: NICHO_QUERY_KEYS.byId(id),
    queryFn: () => NichoRepositoryImpl.getInstance().findById(id),
    enabled: !!id,
  });
};

export const useFindPropietariosByNichoIdQuery = (id: string) => {
  return useQuery<NichoPropietariosResponse>({
    queryKey: [...NICHO_QUERY_KEYS.byId(id), "propietarios"],
    queryFn: () =>
      NichoRepositoryImpl.getInstance().findPropietariosByNichoId(id),
    enabled: !!id,
  });
};

export const useFindNichosByCedulaFallecidoQuery = (cedula: string) => {
  return useQuery<NichoFallecidosEntity>({
    queryKey: NICHO_QUERY_KEYS.byCedulaFallecido(cedula),
    queryFn: () =>
      NichoRepositoryImpl.getInstance().findByCedulaFallecido(cedula),
    enabled: !!cedula && cedula.length === 10,
  });
};

export const useSearchFallecidosQuery = (busqueda: string) => {
  return useQuery<SearchFallecidosEntity>({
    queryKey: NICHO_QUERY_KEYS.searchFallecidos(busqueda),
    queryFn: () => NichoRepositoryImpl.getInstance().searchFallecidos(busqueda),
    enabled: !!busqueda && busqueda.trim().length >= 2,
  });
};
