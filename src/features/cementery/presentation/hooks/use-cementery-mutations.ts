import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CementeryRepositoryImpl } from "../../infrastructure/repositories/cementery.repository.impl";
import { CEMENTERY_QUERY_KEYS } from "../../domain/constants/cementery-keys";
import { CementeryEntity, CementeryCreateEntity, CementeryUpdateEntity } from "../../domain/entities/cementery.entity";
import { toast } from "sonner";

export const useCreateCementeryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<CementeryEntity, Error, CementeryCreateEntity>({
        mutationFn: async (data) => {
            const repository = CementeryRepositoryImpl.getInstance();
            return await repository.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CEMENTERY_QUERY_KEYS.all() });
            toast.success("Cementerio creado exitosamente");
        },
        onError: (error) => {
            toast.error("Error al crear el cementerio", {
                description: error.message,
            });
        },
    });
};

export const useUpdateCementeryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<CementeryEntity, Error, CementeryUpdateEntity>({
        mutationFn: async (data) => {
            const repository = CementeryRepositoryImpl.getInstance();
            return await repository.update(data);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: CEMENTERY_QUERY_KEYS.all() });
            queryClient.invalidateQueries({ queryKey: CEMENTERY_QUERY_KEYS.byId(data.idCementerio) });
            toast.success("Cementerio actualizado exitosamente");
        },
        onError: (error) => {
            toast.error("Error al actualizar el cementerio", {
                description: error.message,
            });
        },
    });
};

export const useDeleteCementeryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<CementeryEntity, Error, string>({
        mutationFn: async (id) => {
            const repository = CementeryRepositoryImpl.getInstance();
            return await repository.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CEMENTERY_QUERY_KEYS.all() });
            toast.success("Cementerio eliminado exitosamente");
        },
        onError: (error) => {
            toast.error("Error al eliminar el cementerio", {
                description: error.message,
            });
        },
    });
}; 