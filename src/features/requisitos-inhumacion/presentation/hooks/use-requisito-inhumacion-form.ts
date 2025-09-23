import { useRouter } from "next/navigation";
import { RequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { useForm } from "react-hook-form";
import { CreateRequisitoInhumacionDTO, CreateRequisitoInhumacionSchema } from "../../domain/schemas/requisito-inhumacion.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRequisitoInhumacionMutation, useUpdateRequisitoInhumacionMutation } from "./use-requisito-inhumacion-mutation";

export function useRequisitoInhumacionForm(requisitoInhumacion?: RequisitoInhumacionEntity) {
    const router = useRouter();
    const methods = useForm<CreateRequisitoInhumacionDTO>({
        resolver: zodResolver(CreateRequisitoInhumacionSchema),
        defaultValues: requisitoInhumacion ? {
            idCementerio: requisitoInhumacion.idCementerio?.idCementerio,
            pantoneroACargo: requisitoInhumacion.pantoneroACargo,
            metodoSolicitud: requisitoInhumacion.metodoSolicitud,
            idSolicitante: requisitoInhumacion.idSolicitante?.id_persona,
            observacionSolicitante: requisitoInhumacion.observacionSolicitante || "",
            copiaCertificadoDefuncion: requisitoInhumacion.copiaCertificadoDefuncion || false,
            informeEstadisticoINEC: requisitoInhumacion.informeEstadisticoINEC || false,
            copiaCedula: requisitoInhumacion.copiaCedula || false,
            pagoTasaInhumacion: requisitoInhumacion.pagoTasaInhumacion || false,
            copiaTituloPropiedadNicho: requisitoInhumacion.copiaTituloPropiedadNicho || false,
            oficioDeSolicitud: requisitoInhumacion.oficioDeSolicitud || false,
            autorizacionDeMovilizacionDelCadaver: requisitoInhumacion.autorizacionDeMovilizacionDelCadaver || false,
            idHuecoNicho: requisitoInhumacion.idHuecoNicho?.idDetalleHueco,
            idFallecido: requisitoInhumacion.idFallecido?.id_persona,
            fechaInhumacion: requisitoInhumacion.fechaInhumacion,
            horaInhumacion: requisitoInhumacion.horaInhumacion,
            nombreAdministradorNicho: requisitoInhumacion.nombreAdministradorNicho,
            observacionCertificadoDefuncion: requisitoInhumacion.observacionCertificadoDefuncion || "",
            observacionInformeEstadisticoINEC: requisitoInhumacion.observacionInformeEstadisticoINEC || "",
            observacionCopiaCedula: requisitoInhumacion.observacionCopiaCedula || "",
            observacionPagoTasaInhumacion: requisitoInhumacion.observacionPagoTasaInhumacion || "",
            observacionCopiaTituloPropiedadNicho: requisitoInhumacion.observacionCopiaTituloPropiedadNicho || "",
            observacionOficioSolicitud: requisitoInhumacion.observacionOficioSolicitud || "",
            observacionAutorizacionMovilizacion: requisitoInhumacion.observacionAutorizacionMovilizacion || "",
        } : {   
        },
    });

    const { mutate: create, isPending: isCreating } = useCreateRequisitoInhumacionMutation();
    const { mutate: update, isPending: isUpdating } = useUpdateRequisitoInhumacionMutation();

    const onSubmit = (data: CreateRequisitoInhumacionDTO) => {        
        console.log("Submitting requisito inhumacion data:", data);

        if (requisitoInhumacion && requisitoInhumacion.idRequsitoInhumacion) {
            update({
                idRequisitoInhumacion: requisitoInhumacion.idRequsitoInhumacion,
                ...data,
            }, {
                onSuccess: () => {
                    console.log("Actualización exitosa");
                    router.push(`/requisitos-inhumacion/${requisitoInhumacion.idRequsitoInhumacion}`);
                },
                onError: (error) => {
                    console.error("Error en actualización:", error);
                },
            });
        } else {
            create(data, {
                onSuccess: () => {
                    console.log("Creación exitosa");
                    router.push("/requisitos-inhumacion");
                },
                onError: (error) => {
                    console.error("Error en creación:", error);
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