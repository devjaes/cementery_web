import { useQuery } from "@tanstack/react-query";
import { PropietarioNichoRepositoryImpl } from "@/features/propietarios-nichos/infrastructure/repositories/propietario-nicho.repository.impl";
import { PROPIETARIO_NICHO_QUERY_KEYS } from "@/features/propietarios-nichos/domain/constants/propietario-nicho-keys";
import { PropietarioNichoEntity } from "@/features/propietarios-nichos/domain/entities/propietario-nicho.entity";

export const useFindPropietariosByNichoQuery = (nichoId: string) => {
  return useQuery<PropietarioNichoEntity[]>({
    queryKey: PROPIETARIO_NICHO_QUERY_KEYS.byNicho(nichoId),
    queryFn: () => PropietarioNichoRepositoryImpl.getInstance().findByNicho(nichoId),
    enabled: !!nichoId,
  });
};

export const useFindPropietarioNichoByIdQuery = (id: string) => {
  return useQuery<PropietarioNichoEntity>({
    queryKey: PROPIETARIO_NICHO_QUERY_KEYS.byId(id),
    queryFn: () => PropietarioNichoRepositoryImpl.getInstance().findById(id),
    enabled: !!id,
  });
};

export const useFindHistorialPropietariosByNichoQuery = (nichoId: string) => {
  return useQuery<PropietarioNichoEntity[]>({
    queryKey: [...PROPIETARIO_NICHO_QUERY_KEYS.byNicho(nichoId), "historial"],
    queryFn: () => PropietarioNichoRepositoryImpl.getInstance().findHistorialByNicho(nichoId),
    enabled: !!nichoId,
  });
};

export const useFindPropietariosByPersonaCedulaQuery = (cedula: string) => {
  return useQuery<PropietarioNichoEntity[]>({
    queryKey: [...PROPIETARIO_NICHO_QUERY_KEYS.byPersona(cedula), "cedula"],
    queryFn: () => PropietarioNichoRepositoryImpl.getInstance().findByPersonaCedula(cedula),
    enabled: !!cedula && cedula.length >= 10,
  });
}; 