import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PropietarioNichoRepositoryImpl } from "@/features/propietarios-nichos/infrastructure/repositories/propietario-nicho.repository.impl";
import { PROPIETARIO_NICHO_QUERY_KEYS } from "@/features/propietarios-nichos/domain/constants/propietario-nicho-keys";
import { CreatePropietarioNichoEntity, PropietarioNichoEntity, UpdatePropietarioNichoEntity } from "@/features/propietarios-nichos/domain/entities/propietario-nicho.entity";

export const useCreatePropietarioNichoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PropietarioNichoEntity, Error, CreatePropietarioNichoEntity>({
    mutationFn: async (data) => {
      const repository = PropietarioNichoRepositoryImpl.getInstance();
      return await repository.create(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROPIETARIO_NICHO_QUERY_KEYS.byNicho(variables.idNicho) });
      toast.success("Propietario agregado exitosamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdatePropietarioNichoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PropietarioNichoEntity, Error, UpdatePropietarioNichoEntity>({
    mutationFn: async (data) => {
      const repository = PropietarioNichoRepositoryImpl.getInstance();
      return await repository.update(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROPIETARIO_NICHO_QUERY_KEYS.byId(variables.idPropietarioNicho) });
      toast.success("Propietario actualizado exitosamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeletePropietarioNichoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const repository = PropietarioNichoRepositoryImpl.getInstance();
      return await repository.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPIETARIO_NICHO_QUERY_KEYS.all() });
      toast.success("Propietario eliminado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar el propietario", {
        description: error.message,
      });
    },
  });
}; 