import { useQuery } from "@tanstack/react-query";
import { PersonEntity } from "../../domain/entities/person.entity";
import { PERSON_QUERY_KEYS } from "../../domain/constants/person-keys";
import { PersonRepositoryImpl } from "../../infraestrcture/repositories/person.repository.impl";

export const useFindAllPersonsQuery = () => {
  return useQuery<PersonEntity[]>({
    queryKey: PERSON_QUERY_KEYS.all(),
    queryFn: () => PersonRepositoryImpl.getInstance().findAll(),
  });
};

export const useFindPersonByIdQuery = (id: string) => {
  return useQuery<PersonEntity>({
    queryKey: PERSON_QUERY_KEYS.byId(id),
    queryFn: () => PersonRepositoryImpl.getInstance().findById(id),
    enabled: !!id,
  });
};

export const useSearchPersonsQuery = (query?: string, vivos?: boolean) => {
  return useQuery<PersonEntity[]>({
    queryKey: PERSON_QUERY_KEYS.search(query, vivos),
    queryFn: () => PersonRepositoryImpl.getInstance().search(query, vivos),
  });
};
