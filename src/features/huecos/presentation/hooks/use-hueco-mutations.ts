import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HuecoRepositoryImpl } from "@/features/huecos/infrastructure/repositories/hueco.repository.impl";
import { HUECO_QUERY_KEYS } from "@/features/huecos/domain/constants/hueco-keys";
import { NICHO_QUERY_KEYS } from "@/features/nichos/domain/constants/nicho-keys";
import { HuecoEntity, CreateHuecoEntity, UpdateHuecoEntity } from "@/features/huecos/domain/entities/hueco.entity";
import { toast } from "sonner";

export const useCreateHuecoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<HuecoEntity, Error, CreateHuecoEntity>({
    mutationFn: async (data) => {
      const repository = HuecoRepositoryImpl.getInstance();
      return await repository.create(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HUECO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: HUECO_QUERY_KEYS.byNicho(variables.idNicho)
      });
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.byId(variables.idNicho) });
      queryClient.invalidateQueries({
        queryKey: ["huecos", "cementerio"],
        exact: false
      });
      toast.success("Hueco creado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al crear el hueco", {
        description: error.message,
      });
    },
  });
};

export const useUpdateHuecoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<HuecoEntity, Error, UpdateHuecoEntity>({
    mutationFn: async (data) => {
      const repository = HuecoRepositoryImpl.getInstance();
      return await repository.update(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: HUECO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: HUECO_QUERY_KEYS.byId(data.idDetalleHueco) });
      queryClient.invalidateQueries({ queryKey: HUECO_QUERY_KEYS.byNicho(data.idNicho!.idNicho!) });
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.byId(data.idNicho!.idNicho!) });
      queryClient.invalidateQueries({
        queryKey: ["huecos", "cementerio"],
        exact: false
      });
      toast.success("Hueco actualizado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar el hueco", {
        description: error.message,
      });
    },
  });
};

export const useDeleteHuecoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const repository = HuecoRepositoryImpl.getInstance();
      return await repository.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HUECO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: ["huecos", "cementerio"],
        exact: false
      });
      toast.success("Hueco eliminado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar el hueco", {
        description: error.message,
      });
    },
  });
}; 