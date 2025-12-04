import { useFindHuecosByNichoQuery } from "./use-hueco-queries";
import { useFindNichoByIdQuery } from "@/features/nichos/presentation/hooks/use-nicho-queries";
import {
  useDeleteHuecoMutation,
  useCreateHuecoMutation,
} from "./use-hueco-mutations";
import {
  HuecoEntity,
  CreateHuecoEntity,
} from "../../domain/entities/hueco.entity";

interface UseNichoHuecosListProps {
  nichoId: string;
}

export function useNichoHuecosList({ nichoId }: UseNichoHuecosListProps) {
  // Queries
  const {
    data: huecos,
    isLoading,
    error,
    refetch,
  } = useFindHuecosByNichoQuery(nichoId);

  const { data: nicho } = useFindNichoByIdQuery(nichoId);

  // Mutations
  const { mutate: deleteHueco, isPending: isDeleting } = useDeleteHuecoMutation();
  const { mutate: createHueco, isPending: isCreating } = useCreateHuecoMutation();

  // Handlers
  const handleDelete = (id: string) => {
    deleteHueco(id, {
      onSuccess: () => refetch(),
    });
  };

  /**
   * Crea un hueco nuevo recibiendo directamente el objeto CreateHuecoEntity.
   */
  const handleCreateHueco = (data: CreateHuecoEntity) => {
    createHueco(data, {
      onSuccess: () => refetch(),
    });
  };

  // Business Logic
  const getMaxHuecosByTipo = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case "fosa":
        return 1; // solo 1 permitido

      case "nicho":
      case "mausoleo":
        return Infinity; // ilimitado

      default:
        return Infinity;
    }
  };

  const canCreateHueco = () => {
    if (!nicho || !huecos) return false;

    // Si es fosa, solo permitir 1
    if (nicho.tipo?.toLowerCase() === "fosa") {
      return huecos.length < 1;
    }

    // Nicho o Mausoleo → ilimitado siempre permite crear
    return true;
  };

  const getCreateButtonMessage = () => {
    if (!nicho || !huecos) return "Crear Hueco";

    const current = huecos.length;

    if (nicho.tipo?.toLowerCase() === "fosa") {
      return current >= 1 ? "Límite alcanzado (1/1)" : "Crear Hueco (0/1)";
    }

    // Para Nicho y Mausoleo solo mostramos cuantos hay
    return `Crear Hueco `;
  };


  const canDeleteHueco = (hueco: HuecoEntity) => {
    // No se puede eliminar si está ocupado
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
