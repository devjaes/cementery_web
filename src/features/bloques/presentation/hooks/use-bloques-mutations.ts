import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BloqueRepositoryImpl } from "../../infrastructure/repositories/bloque.repository.impl";
import { BLOQUES_QUERY_KEYS } from "../../domain/constants/bloques-keys";
import { BloqueCreateEntity, BloqueEntity, BloqueUpdateEntity } from "../../domain/entities/bloque.entity";
import { AmpliarBloqueEntity, AmpliarBloqueResponseEntity } from "../../domain/entities/ampliar-bloque.entity";
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

export const useAmpliarBloqueMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AmpliarBloqueResponseEntity,
    Error,
    { idBloque: string; data: AmpliarBloqueEntity }
  >({
    mutationFn: async ({ idBloque, data }) =>
      BloqueRepositoryImpl.getInstance().ampliarBloque(idBloque, data),
    onSuccess: (response, variables) => {
      toast.success("Mausoleo ampliado exitosamente", {
        description: `Se agregaron ${response.ampliacion.filas_agregadas} filas con ${response.ampliacion.nichos_creados} nichos`,
      });
      // Invalidar queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.byId(variables.idBloque) });
      queryClient.invalidateQueries({ queryKey: [...BLOQUES_QUERY_KEYS.byId(variables.idBloque), 'nichos'] });
      if (response.bloque.id_bloque) {
        queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.byCementery(response.bloque.id_bloque) });
      }
    },
    onError: (err) => toast.error("Error al ampliar el mausoleo", { description: err.message }),
  });
};
