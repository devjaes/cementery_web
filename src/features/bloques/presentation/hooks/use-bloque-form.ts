import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBloqueMutation } from "./use-bloques-mutations";

const schema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string().optional(),
  numeroFilas: z.coerce.number().min(1, "Mínimo 1"),
  numeroColumnas: z.coerce.number().min(1, "Mínimo 1"),
});

export type BloqueFormValues = z.infer<typeof schema>;

export function useBloqueForm(idCementerio: string, onSuccess?: () => void) {
  const methods = useForm<BloqueFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      numeroFilas: 1,
      numeroColumnas: 1,
    },
  });

  const { mutateAsync, isPending } = useCreateBloqueMutation();

  const onSubmit = async (values: BloqueFormValues) => {
    await mutateAsync({
      idCementerio,
      nombre: values.nombre,
      descripcion: values.descripcion,
      numeroFilas: values.numeroFilas,
      numeroColumnas: values.numeroColumnas,
    });
    methods.reset();
    onSuccess?.();
  };

  return { methods, onSubmit, isPending };
}
