import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NichoRepositoryImpl } from "../../infrastructure/repositories/nicho.repository.impl";
import { NICHO_QUERY_KEYS } from "../../domain/constants/nicho-keys";
import { NichoEntity, CreateNichoEntity, UpdateNichoEntity } from "../../domain/entities/nicho.entity";
import { toast } from "sonner";

export const useCreateNichoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<NichoEntity, Error, CreateNichoEntity>({
    mutationFn: async (data) => {
      const repository = NichoRepositoryImpl.getInstance();
      return await repository.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      toast.success("Nicho creado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al crear el nicho", {
        description: error.message,
      });
    },
  });
};

export const useUpdateNichoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<NichoEntity, Error, UpdateNichoEntity>({
    mutationFn: async (data) => {
      const repository = NichoRepositoryImpl.getInstance();
      return await repository.update(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.byId(data.idNicho!) });
      toast.success("Nicho actualizado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar el nicho", {
        description: error.message,
      });
    },
  });
};

export const useDeleteNichoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const repository = NichoRepositoryImpl.getInstance();
      return await repository.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      toast.success("Nicho eliminado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar el nicho", {
        description: error.message,
      });
    },
  });
}; 