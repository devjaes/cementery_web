import { useFindHuecosByNichoQuery } from "./use-hueco-queries";
import { useFindNichoByIdQuery } from "@/features/nichos/presentation/hooks/use-nicho-queries";
import { useDeleteHuecoMutation, useCreateHuecoMutation } from "./use-hueco-mutations";
import { HuecoEntity } from "../../domain/entities/hueco.entity";

interface UseNichoHuecosListProps {
  nichoId: string;
}

export function useNichoHuecosList({ nichoId }: UseNichoHuecosListProps) {
  // Queries
  const { data: huecos, isLoading, error, refetch } = useFindHuecosByNichoQuery(nichoId);
  const { data: nicho } = useFindNichoByIdQuery(nichoId);
  
  // Mutations
  const { mutate: deleteHueco, isPending: isDeleting } = useDeleteHuecoMutation();
  const { mutate: createHueco, isPending: isCreating } = useCreateHuecoMutation();

  // Handlers
  const handleDelete = (id: string) => {
    deleteHueco(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleCreateHueco = () => {
    createHueco({ idNicho: nichoId }, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Business Logic
  const getMaxHuecosByTipo = (tipo: string) => {
    switch (tipo) {
      case "Mausoleo":
        return 9;
      case "Nicho":
      case "Fosa":
        return 1;
      default:
        return 1;
    }
  };

  const canCreateHueco = () => {
    if (!nicho || !huecos) return false;
    
    const currentHuecos = huecos.length;
    const maxHuecos = getMaxHuecosByTipo(nicho.tipo);
    
    return currentHuecos < maxHuecos;
  };

  const getCreateButtonMessage = () => {
    if (!nicho || !huecos) return "Crear Hueco";
    
    const currentHuecos = huecos.length;
    const maxHuecos = getMaxHuecosByTipo(nicho.tipo);
    
    if (currentHuecos >= maxHuecos) {
      return `Límite alcanzado (${maxHuecos}/${maxHuecos})`;
    }
    
    return `Crear Hueco (${currentHuecos}/${maxHuecos})`;
  };

  const canDeleteHueco = (hueco: HuecoEntity) => {
    // No se puede eliminar si está ocupado (tiene un fallecido asignado)
    return hueco.estado !== "Ocupado" && !hueco.idFallecido;
  };

  return {
    // Data
    huecos,
    nicho,
    isLoading,
    error,
    
    // States
    isDeleting,
    isCreating,
    
    // Handlers
    handleDelete,
    handleCreateHueco,
    
    // Business Logic
    canCreateHueco,
    getCreateButtonMessage,
    canDeleteHueco,
  };
} 