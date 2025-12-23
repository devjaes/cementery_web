import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExhumacionRepositoryImpl } from "../../infrastructure/repositories/exhumacion.repository.impl";
import { EXHUMACION_QUERY_KEYS } from "../../domain/constants/exhumacion-keys";
import { CreateExhumacionEntity, UpdateExhumacionEntity, ExhumacionEntity } from "../../domain/entities/exhumacion.entity";

export const useCreateExhumacionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ExhumacionEntity, Error, CreateExhumacionEntity | FormData>({
    mutationFn: async (data) => {
      const repository = ExhumacionRepositoryImpl.getInstance();
      return await repository.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXHUMACION_QUERY_KEYS.all() });
      toast.success("Exhumación registrada exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al registrar exhumación: ${error.message}`);
    },
  });
};

export const useUpdateExhumacionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ExhumacionEntity, Error, UpdateExhumacionEntity>({
    mutationFn: async (data) => {
      const repository = ExhumacionRepositoryImpl.getInstance();
      return await repository.update(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EXHUMACION_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: EXHUMACION_QUERY_KEYS.byId(variables.idExhumacion) });
      toast.success("Exhumación actualizada exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al actualizar exhumación: ${error.message}`);
    },
  });
};

export const useDeleteExhumacionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const repository = ExhumacionRepositoryImpl.getInstance();
      return await repository.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXHUMACION_QUERY_KEYS.all() });
      toast.success("Exhumación eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al eliminar exhumación: ${error.message}`);
    },
  });
};

export const useUploadComprobanteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ExhumacionEntity, Error, { id: string; file: File }>({
    mutationFn: async ({ id, file }) => {
      const repository = ExhumacionRepositoryImpl.getInstance();
      return await repository.uploadComprobante(id, file);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EXHUMACION_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: EXHUMACION_QUERY_KEYS.byId(variables.id) });
      toast.success("Comprobante subido exitosamente. Estado actualizado a finalizado.");
    },
    onError: (error) => {
      toast.error(`Error al subir comprobante: ${error.message}`);
    },
  });
};
