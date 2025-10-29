import { useQuery } from "@tanstack/react-query";
import { MejoraEntity } from "../../domain/entities/mejora.entity";
import { MejoraRepositoryImpl } from "../../infraestructure/repositories/mejora.repository.impl";

const KEYS = {
  all: () => ["mejoras"],
  byId: (id: string) => ["mejoras", id],
  search: (q: string) => ["mejoras", "search", q],
};

export const useFindAllMejorasQuery = () => {
  return useQuery<MejoraEntity[]>({
    queryKey: KEYS.all(),
    queryFn: () => MejoraRepositoryImpl.getInstance().findAll(),
  });
};

export const useFindMejoraByIdQuery = (id: string) => {
  return useQuery<MejoraEntity>({
    queryKey: KEYS.byId(id),
    queryFn: () => MejoraRepositoryImpl.getInstance().findById(id),
    enabled: !!id,
  });
};

export const useSearchMejorasQuery = (q: string) => {
  return useQuery<MejoraEntity[]>({
    queryKey: KEYS.search(q),
    queryFn: () => MejoraRepositoryImpl.getInstance().search(q),
    enabled: !!q && q.trim().length >= 2,
  });
};


