import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CreateInhumacionDTO, CreateInhumacionSchema } from "../../domain/schemas/inhumacion.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { InhumacionEntity } from "../../domain/entities/inhumacion.entity";
import { useCreateInhumacionMutation, useUpdateInhumacionMutation } from "./use-inhumacion-mutation";


export function useInhumacionForm(inhumacion?: InhumacionEntity) {
    const router = useRouter();
            console.log("Initializing form with inhumacion data:", inhumacion);
    const methods = useForm<CreateInhumacionDTO>({        
        resolver: zodResolver(CreateInhumacionSchema),
        defaultValues: inhumacion ? {
            idNicho: inhumacion.idNicho.idNicho,
            idFallecido: inhumacion.idFallecido.id_persona,
            fechaInhumacion: inhumacion.fechaInhumacion,
            horaInhumacion: inhumacion.horaInhumacion,
            solicitante: inhumacion.solicitante,
            responsableInhumacion: inhumacion.responsableInhumacion,
            observaciones: inhumacion.observaciones ?? "",
            estado: inhumacion.estado as CreateInhumacionDTO["estado"],
            codigoInhumacion: inhumacion.codigoInhumacion,
        } : {},
    });
    const { mutate: create, isPending: isCreating } = useCreateInhumacionMutation();
    const { mutate: update, isPending: isUpdating } = useUpdateInhumacionMutation();

    const onSubmit = (data: CreateInhumacionDTO) => {

        console.log("Submitting inhumacion data:", data);
        if (inhumacion && inhumacion.idInhumacion) {
            update({
                idInhumacion: inhumacion.idInhumacion,
                ...data,
            }, {
                onSuccess: () => {
                    router.push("/inhumaciones");
                },
            });
        } else {
            create(data, {
                onSuccess: () => {
                    router.push("/inhumaciones");
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