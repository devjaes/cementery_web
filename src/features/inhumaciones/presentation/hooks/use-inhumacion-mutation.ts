import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateInhumacionEntity, InhumacionEntity, UpdateInhumacionEntity } from "../../domain/entities/inhumacion.entity";
import { InhumacionRepositoryImpl } from "../../infrastructure/repositories/inhumacion.repository.impl";
import { toast } from "sonner";
import { INHUMACION_QUERY_KEYS } from "../../domain/constants/inhumacion-key";

export const useCreateInhumacionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<InhumacionEntity, Error, CreateInhumacionEntity>({
        mutationFn: async (data) => {
            const repository = InhumacionRepositoryImpl.getInstance();
            return await repository.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INHUMACION_QUERY_KEYS.all() });
            toast.success("Inhumación creada exitosamente");
        },
        onError: (error) => {
            toast.error("Error al crear la inhumación", {
                description: error.message,
            });
        },
    })
}

export const useUpdateInhumacionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<InhumacionEntity, Error, UpdateInhumacionEntity>({
        mutationFn: async (data) => {
            const repository = InhumacionRepositoryImpl.getInstance();
            return await repository.update(data);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: INHUMACION_QUERY_KEYS.all() });
            queryClient.invalidateQueries({ queryKey: INHUMACION_QUERY_KEYS.byId(data.idInhumacion) });
            toast.success("Inhumación actualizada exitosamente");
        },
        onError: (error) => {
            toast.error("Error al actualizar la inhumación", {
                description: error.message,
            });
        },
    })
}


export const useDeleteInhumacionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (id) => {
            const repository = InhumacionRepositoryImpl.getInstance();
            return await repository.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INHUMACION_QUERY_KEYS.all() });
            toast.success("Inhumación eliminada exitosamente");
        },
        onError: (error) => {
            toast.error("Error al eliminar la inhumación", {
                description: error.message,
            });
        },
    })
}