import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateNichoSchema,
  CreateNichoDTO,
} from "../../domain/schemas/nicho.schema";
import { NichoEntity } from "../../domain/entities/nicho.entity";
import {
  useCreateNichoMutation,
  useUpdateNichoMutation,
} from "./use-nicho-mutations";
import { useRouter } from "next/navigation";

export function useNichoForm(nicho?: NichoEntity) {
  const router = useRouter();
  const methods = useForm<CreateNichoDTO>({
    resolver: zodResolver(CreateNichoSchema),
    defaultValues: nicho
      ? {
          idCementerio: nicho.idCementerio?.idCementerio,
          sector: nicho.sector,
          fila: nicho.fila,
          numero: nicho.numero,
          tipo: nicho.tipo as CreateNichoDTO["tipo"],
          fechaConstruccion: nicho.fechaConstruccion,
          observaciones: nicho.observaciones,
          numHuecos: nicho.numHuecos,
        }
      : {},
  });
  const { mutate: create, isPending: isCreating } = useCreateNichoMutation();
  const { mutate: update, isPending: isUpdating } = useUpdateNichoMutation();

  const onSubmit = (data: CreateNichoDTO) => {
    if (nicho && nicho.idNicho) {
      update(
        {
          idNicho: nicho.idNicho,
          ...data,
        },
        {
          onSuccess: () => {
            router.push("/nichos");
          },
        }
      );
    } else {
      create(data, {
        onSuccess: (response) => {
          router.push(`/nichos/${response.idNicho}`);
        },
      });
    }
  };

  return {
    methods,
    onSubmit,
    isPending: isCreating || isUpdating,
  };
}
