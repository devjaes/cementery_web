import { useRouter } from "next/navigation";
import { RequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { useForm } from "react-hook-form";
import { CreateRequisitoInhumacionDTO, CreateRequisitoInhumacionSchema } from "../../domain/schemas/requisito-inhumacion.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useCreateRequisitoInhumacionMutation,
    useUpdateRequisitoInhumacionMutation,
    useDownloadRequisitoInhumacionPdfMutation,
} from "./use-requisito-inhumacion-mutation";
import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import { RequisitoInhumacionRepositoryImpl } from "../../infraestructure/repositories/requisito-inhumacion.repository.impl";
import { toast } from "sonner";

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
    const { mutateAsync: downloadPdfAsync } = useDownloadRequisitoInhumacionPdfMutation();

    const http = AxiosClient.getInstance();

    const resolveInhumacionIdByFallecido = async (idFallecido?: string): Promise<string | null> => {
        try {
            if (!idFallecido) return null;
            // 1) Obtener cédula del fallecido
            const personaResp = await http.get<any>(API_ROUTES.PERSONS.GET_BY_ID(idFallecido));
            const cedula: string | undefined = personaResp?.data?.data?.cedula;
            if (!cedula) return null;
            // 2) Buscar inhumaciones por cédula (usar respuesta cruda)
            const inhResp = await http.get<any>(API_ROUTES.INHUMACIONES.SEARCH_FALLECIDOS(cedula));
            const payload = inhResp?.data?.data;
            // Intentar navegar estructura conocida: { fallecidos: [ { inhumaciones: [...] } ] }
            const first = Array.isArray(payload?.fallecidos) ? payload.fallecidos[0] : null;
            const inhs = first?.inhumaciones || first?.persona?.inhumaciones || payload?.inhumaciones || [];
            if (Array.isArray(inhs) && inhs.length > 0) {
                const id = inhs[0]?.id_inhumacion || inhs[0]?.idInhumacion || inhs[0]?.id;
                return id || null;
            }
            return null;
        } catch (e) {
            console.warn("No se pudo resolver id_inhumacion:", e);
            return null;
        }
    };

    const getCedulaByFallecidoId = async (idFallecido?: string): Promise<string | null> => {
        try {
            if (!idFallecido) return null;
            const personaResp = await http.get<any>(API_ROUTES.PERSONS.GET_BY_ID(idFallecido));
            return personaResp?.data?.data?.cedula || null;
        } catch {
            return null;
        }
    };

    const uploadSolicitudFirmadaIfNeeded = async (selectedDocument: File | undefined, requisitoIdOrIdFallecido?: string, maybeIdFallecido?: string): Promise<boolean> => {
        try {
            if (!selectedDocument) return false;
            const repo = RequisitoInhumacionRepositoryImpl.getInstance();

            // If caller passed a requisitoId (result from create/update), upload directly to requisitos-inhumacion endpoint
            if (requisitoIdOrIdFallecido) {
                try {
                    console.log("[upload] Intentando subir documento consolidado al requisitoId=", requisitoIdOrIdFallecido);
                    const resp = await repo.uploadConsolidatedDocumentForRequisito(requisitoIdOrIdFallecido, selectedDocument);
                    console.log("[upload] Respuesta subida documento consolidado:", resp?.status, resp?.data);
                    toast.success("Documento subido correctamente");
                    return true;
                } catch (err) {
                    console.warn("[upload] Fallback: no se pudo subir al endpoint de requisito:", err);
                    // continue to fallback below
                }
            }

            // Fallback: try resolving inhumacion id by fallecido
            const idFallecido = maybeIdFallecido || requisitoIdOrIdFallecido;
            const inhumacionId = await resolveInhumacionIdByFallecido(idFallecido);
            console.log("[upload] idFallecido=", idFallecido, " -> inhumacionId=", inhumacionId);
            if (!inhumacionId) {
                console.warn("[upload] No se pudo resolver id_inhumacion; se omite subida");
                toast.warning("No se pudo resolver la inhumación para subir el documento");
                return false;
            }
            const resp = await repo.uploadDocuments(inhumacionId, { solicitud_firmada: selectedDocument });
            console.log("[upload] Respuesta subida documentos:", resp?.status, resp?.data);
            toast.success("Documento subido correctamente");
            return true;
        } catch (e) {
            console.warn("[upload] Fallo al subir solicitud_firmada:", e);
            toast.error("Error al subir el documento");
            return false;
        }
    };

    const onSubmit = (data: CreateRequisitoInhumacionDTO, selectedDocument?: File) => {        
        console.log("Submitting requisito inhumacion data:", data);

        // Decide whether we are updating or creating. Accept both possible id property names.
        const requisitoAny = requisitoInhumacion as any;
        const hasExistingId = !!(requisitoAny && (requisitoAny.idRequsitoInhumacion || requisitoAny.idRequisitoInhumacion));

        if (hasExistingId) {
            // prefer the existing id value (support both spellings)
            const existingId = requisitoAny?.idRequsitoInhumacion ?? requisitoAny?.idRequisitoInhumacion;
            update({
                idRequisitoInhumacion: existingId as string,
                ...data,
            }, {
                onSuccess: async (result) => {
                    console.log("Actualización exitosa - result:", result);
                    // normalize id returned by backend: try multiple fields
                    const resultAny = result as any;
                    const requisitoId = resultAny?.idRequsitoInhumacion ?? resultAny?.idRequisitoInhumacion ?? resultAny?.id;
                    console.log("[upload] resolved requisitoId:", requisitoId);
                    await uploadSolicitudFirmadaIfNeeded(selectedDocument, requisitoId, data.idFallecido);
                    // intentar descargar automáticamente el PDF generado antes de redirigir
                    try {
                        if (requisitoId) await downloadPdfAsync(requisitoId);
                    } catch (err) {
                        console.warn("No se pudo descargar automáticamente el PDF:", err);
                        // Fallback: abrir la URL directa del endpoint en una nueva pestaña para que el usuario pueda descargar/manualmente
                        try {
                            const base = (process.env.NEXT_PUBLIC_BACKEND_API_URL || '').replace(/\/$/, '');
                            const url = `${base}/${API_ROUTES.REQUISITOS_INHUMACION.DOWNLOAD_PDF(requisitoId)}`;
                            // abrir en nueva pestaña
                            window.open(url, '_blank');
                        } catch (e) {
                            console.warn('Fallback de descarga falló:', e);
                        }
                    }
                    const cedula = await getCedulaByFallecidoId(data.idFallecido);
                    router.push(cedula ? `/requisitos-inhumacion?q=${encodeURIComponent(cedula)}` : "/requisitos-inhumacion");
                },
                onError: (error) => {
                    console.error("Error en actualización:", error);
                },
            });
        } else {
            create(data, {
                onSuccess: async (result) => {
                    console.log("Creación exitosa - result:", result);
                    // normalize id returned by backend: try multiple fields
                    const resultAny = result as any;
                    const requisitoId = resultAny?.idRequsitoInhumacion ?? resultAny?.idRequisitoInhumacion ?? resultAny?.id;
                    console.log("[upload] resolved requisitoId:", requisitoId);
                    await uploadSolicitudFirmadaIfNeeded(selectedDocument, requisitoId, data.idFallecido);
                    // intentar descargar automáticamente el PDF generado antes de redirigir
                    try {
                        if (requisitoId) await downloadPdfAsync(requisitoId);
                    } catch (err) {
                        console.warn("No se pudo descargar automáticamente el PDF:", err);
                    }
                    const cedula = await getCedulaByFallecidoId(data.idFallecido);
                    router.push(cedula ? `/requisitos-inhumacion?q=${encodeURIComponent(cedula)}` : "/requisitos-inhumacion");
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