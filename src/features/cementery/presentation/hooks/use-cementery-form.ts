import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCementerySchema, CreateCementeryDTO } from "../../domain/schemas/cementery.schema";
import { CementeryEntity } from "../../domain/entities/cementery.entity";
import { useCreateCementeryMutation, useUpdateCementeryMutation } from "../hooks/use-cementery-mutations";
import { useRouter } from "next/navigation";

interface UseCementeryFormOptions {
  cementery?: CementeryEntity;
  onSuccess?: () => void;
}

export function useCementeryForm({ cementery, onSuccess }: UseCementeryFormOptions = {}) {
  const router = useRouter();
  const methods = useForm<CreateCementeryDTO>({
    resolver: zodResolver(CreateCementerySchema),
    defaultValues: cementery ? {
      nombre: cementery.nombre,
      direccion: cementery.direccion,
      telefono: cementery.telefono,
      responsable: cementery.responsable,
    } : {},
  });
  const { mutate: create, isPending: isCreating } = useCreateCementeryMutation();
  const { mutate: update, isPending: isUpdating } = useUpdateCementeryMutation();

  const onSubmit = (data: CreateCementeryDTO) => {
    if (cementery && cementery.idCementerio) {
      update({
        idCementerio: cementery.idCementerio,
        ...data,
      }, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/cementerio");
          }
        },
      });
    } else {
      create(data, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/cementerio");
          }
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