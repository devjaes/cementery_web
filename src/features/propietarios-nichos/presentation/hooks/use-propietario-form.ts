import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePropietarioNichoSchema, CreatePropietarioNichoDTO } from "@/features/propietarios-nichos/domain/schemas/propietario-nicho.schema";
import { useCreatePropietarioNichoMutation } from "./use-propietario-nicho-mutations";

export function usePropietarioForm(nichoId: string, onSuccess?: () => void) {
  const methods = useForm<CreatePropietarioNichoDTO>({
    resolver: zodResolver(CreatePropietarioNichoSchema),
    defaultValues: {
      idNicho: nichoId,
      tipo: "Dueño",
    },
  });

  const { mutate: create, isPending } = useCreatePropietarioNichoMutation();

  const onSubmit = (data: CreatePropietarioNichoDTO) => {
    create(data, {
      onSuccess: () => {
        methods.reset();
        onSuccess?.();
      },
    });
  };

  return {
    methods,
    onSubmit,
    isPending,
  };
} 