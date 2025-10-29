import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateMejoraEntity, MejoraEntity } from "../../domain/entities/mejora.entity";
import { MejoraRepositoryImpl } from "../../infraestructure/repositories/mejora.repository.impl";

const KEYS = {
  all: () => ["mejoras"],
};

export const useCreateMejoraMutation = () => {
  const qc = useQueryClient();
  return useMutation<MejoraEntity, Error, CreateMejoraEntity>({
    mutationFn: (data) => MejoraRepositoryImpl.getInstance().create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all() });
      toast.success("Solicitud de mejoras creada correctamente");
    },
    onError: (e) => toast.error("Error al crear la solicitud de mejoras", { description: e.message }),
  });
};

export const useUploadMejoraFilesMutation = () => {
  return useMutation<void, Error, { id: string; files: File[] }>({
    mutationFn: ({ id, files }) => MejoraRepositoryImpl.getInstance().uploadFiles(id, files),
  });
};


