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
            // Ensure UI reflects updated inhumación immediately
            try {
                // Update single inhumación cache
                queryClient.setQueryData(
                    INHUMACION_QUERY_KEYS.byId(data.idInhumacion),
                    data
                );

                // Update list cache: if present, replace the updated item
                queryClient.setQueryData(
                    INHUMACION_QUERY_KEYS.all(),
                    (old: any) => {
                        if (!old) return old;
                        try {
                            const list = Array.isArray(old) ? old : (old?.data || old?.inhumaciones || []);
                            const updated = (list || []).map((item: any) =>
                                item.idInhumacion === data.idInhumacion ? data : item
                            );
                            // preserve original shape if possible
                            if (Array.isArray(old)) return updated;
                            if (old?.data) return { ...old, data: updated };
                            if (old?.inhumaciones) return { ...old, inhumaciones: updated };
                            return updated;
                        } catch (e) {
                            return old;
                        }
                    }
                );
            } catch (e) {
                // fallback to invalidation if setQueryData fails
                queryClient.invalidateQueries({ queryKey: INHUMACION_QUERY_KEYS.all() });
                queryClient.invalidateQueries({ queryKey: INHUMACION_QUERY_KEYS.byId(data.idInhumacion) });
            }

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