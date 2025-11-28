import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NichoRepositoryImpl } from "../../infrastructure/repositories/nicho.repository.impl";
import { NICHO_QUERY_KEYS } from "../../domain/constants/nicho-keys";
    import { BLOQUES_QUERY_KEYS } from "@/features/bloques/domain/constants/bloques-keys";
import { NichoEntity, EnableNichoEntity } from "../../domain/entities/nicho.entity";
import { toast } from "sonner";

export const useEnableNicho = () => {
  const queryClient = useQueryClient();

  return useMutation<NichoEntity, Error, { nichoId: string; data: EnableNichoEntity }>({
    mutationFn: async ({ nichoId, data }) => {
      const repository = NichoRepositoryImpl.getInstance();
      return await repository.enable(nichoId, data);
    },
    onSuccess: (data) => {
      // Invalidar queries de nichos
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.byId(data.idNicho!) });
      
      // Invalidar queries de bloques para refrescar el mapa
      queryClient.invalidateQueries({ queryKey: BLOQUES_QUERY_KEYS.all() });
      
      toast.success("Nicho habilitado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al habilitar el nicho", {
        description: error.message,
      });
    },
  });
};
