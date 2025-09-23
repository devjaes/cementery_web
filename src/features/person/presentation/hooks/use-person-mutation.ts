import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePersonEntity, PersonEntity, UpdatePersonEntity } from "../../domain/entities/person.entity";
import { PersonRepositoryImpl } from "../../infraestrcture/repositories/person.repository.impl";
import { PERSON_QUERY_KEYS } from "../../domain/constants/person-keys";
import { toast } from "sonner";

export const useCreatePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PersonEntity, Error, CreatePersonEntity>({
    mutationFn: async (data) => {
      console.log("Creating person with data:", data);
      const repository = PersonRepositoryImpl.getInstance();
      return await repository.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERSON_QUERY_KEYS.all() });
      toast.success("Persona creada exitosamente");
    },
    onError: (error) => {
      toast.error("Error al crear la persona", {
        description: error.message,
      });
    },
  });
};

export const useUpdatePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PersonEntity, Error, UpdatePersonEntity>({
    mutationFn: async (data) => {
      const repository = PersonRepositoryImpl.getInstance();
      return await repository.update(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PERSON_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: PERSON_QUERY_KEYS.byId(data.id_persona) });
      toast.success("Persona actualizada exitosamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar la persona", {
        description: error.message,
      });
    },
  });
};	

export const useDeletePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const repository = PersonRepositoryImpl.getInstance();
      return await repository.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERSON_QUERY_KEYS.all() });
      toast.success("Persona eliminada exitosamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar la persona", {
        description: error.message,
      });
    },
  });
};
