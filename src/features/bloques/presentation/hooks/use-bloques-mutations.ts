import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BloqueRepositoryImpl } from "../../infrastructure/repositories/bloque.repository.impl";
import { BLOQUES_QUERY_KEYS } from "../../domain/constants/bloques-keys";
import { BloqueCreateEntity, BloqueEntity, BloqueUpdateEntity } from "../../domain/entities/bloque.entity";
import { toast } from "sonner";

export const useCreateBloqueMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<BloqueEntity, Error, BloqueCreateEntity>({
    mutationFn: async (data) => BloqueRepositoryImpl.getInstance().create(data),
    onSuccess: (data) => {
      toast.success("Bloque creado exitosamente");
      queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.byCementery(data.idCementerio) });
    },
    onError: (err) => toast.error("Error al crear el bloque", { description: err.message }),
  });
};

export const useUpdateBloqueMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<BloqueEntity, Error, BloqueUpdateEntity>({
    mutationFn: async (data) => BloqueRepositoryImpl.getInstance().update(data),
    onSuccess: (data) => {
      toast.success("Bloque actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.byId(data.idBloque) });
      queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.byCementery(data.idCementerio) });
    },
    onError: (err) => toast.error("Error al actualizar el bloque", { description: err.message }),
  });
};

export const useDeleteBloqueMutation = (idCementerio: string) => {
  const queryClient = useQueryClient();
  return useMutation<BloqueEntity, Error, string>({
    mutationFn: async (id) => BloqueRepositoryImpl.getInstance().delete(id),
    onSuccess: () => {
      toast.success("Bloque eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.byCementery(idCementerio) });
    },
    onError: (err) => toast.error("Error al eliminar el bloque", { description: err.message }),
  });
};
