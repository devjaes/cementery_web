"use client";
import { useRouter } from "next/navigation";
import { PersonEntity } from "../../domain/entities/person.entity";
import { CreatePersonDTO, CreatePersonSchema } from "../../domain/schemas/person.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePersonMutation, useUpdatePersonMutation } from "./use-person-mutation";

export function usePersonForm(person?: PersonEntity) {
  const router = useRouter();
  const methods = useForm<CreatePersonDTO>({
    resolver: zodResolver(CreatePersonSchema),
    defaultValues: person ? {

        cedula: person.cedula,
        nombres: person.nombres,
        apellidos: person.apellidos,
        fecha_nacimiento: person.fecha_nacimiento,
        fecha_defuncion: person.fecha_defuncion ?? undefined,
        fecha_inhumacion: person.fecha_inhumacion ?? undefined,
        lugar_defuncion: person.lugar_defuncion ?? undefined,
        causa_defuncion: person.causa_defuncion ?? undefined,
        fallecido: person.fallecido ,
        nacionalidad: person.nacionalidad ?? undefined,
        direccion: person.direccion ?? undefined,
        telefono: person.telefono ?? undefined,
        correo: person.correo ?? undefined,
      
    } : {},
  });
  
  const { mutate: create, isPending: isCreating } = useCreatePersonMutation();
  const { mutate: update, isPending: isUpdating } = useUpdatePersonMutation();

  const onSubmit = (data: CreatePersonDTO) => {
    if (person && person.id_persona) {
      update({
        id_persona: person.id_persona,
        ...data,
      }, {
        onSuccess: () => {
          router.push("/persons");
        },
      });
    } else {
      create(data, {
        onSuccess: () => {
          router.push("/persons");
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