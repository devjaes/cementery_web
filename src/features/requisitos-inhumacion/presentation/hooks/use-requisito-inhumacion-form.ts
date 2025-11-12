import { useRouter } from "next/navigation";
import { RequisitoInhumacionEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { useForm } from "react-hook-form";
import {
  CreateRequisitoInhumacionDTO,
  CreateRequisitoInhumacionSchema,
} from "../../domain/schemas/requisito-inhumacion.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateRequisitoInhumacionMutation,
  useUpdateRequisitoInhumacionMutation,
} from "./use-requisito-inhumacion-mutation";
import { useDownloadRequisitoInhumacionPdfMutation } from "./use-requisito-inhumacion-mutation";
import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequisitoInhumacionRepositoryImpl } from "../../infraestructure/repositories/requisito-inhumacion.repository.impl";
import { InhumacionRepositoryImpl } from "@/features/inhumaciones/infrastructure/repositories/inhumacion.repository.impl";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

export function useRequisitoInhumacionForm(
  requisitoInhumacion?: RequisitoInhumacionEntity
) {
  const router = useRouter();
  const methods = useForm<CreateRequisitoInhumacionDTO>({
    resolver: zodResolver(CreateRequisitoInhumacionSchema),
    defaultValues: requisitoInhumacion
      ? {
         codigoInhumacion: (requisitoInhumacion as any)?.codigoInhumacion || "",
          idCementerio: requisitoInhumacion.idCementerio?.idCementerio,
          pantoneroACargo: requisitoInhumacion.pantoneroACargo,
          metodoSolicitud: requisitoInhumacion.metodoSolicitud,
          idSolicitante: requisitoInhumacion.idSolicitante?.id_persona,
          observacionSolicitante:
            requisitoInhumacion.observacionSolicitante || "",
          copiaCertificadoDefuncion:
            requisitoInhumacion.copiaCertificadoDefuncion || false,
          informeEstadisticoINEC:
            requisitoInhumacion.informeEstadisticoINEC || false,
          copiaCedula: requisitoInhumacion.copiaCedula || false,
          pagoTasaInhumacion: requisitoInhumacion.pagoTasaInhumacion || false,
          copiaTituloPropiedadNicho:
            requisitoInhumacion.copiaTituloPropiedadNicho || false,
          oficioDeSolicitud: requisitoInhumacion.oficioDeSolicitud || false,
          autorizacionDeMovilizacionDelCadaver:
            requisitoInhumacion.autorizacionDeMovilizacionDelCadaver || false,
          idHuecoNicho: requisitoInhumacion.idHuecoNicho?.idDetalleHueco,
          idFallecido: requisitoInhumacion.idFallecido?.id_persona,
          fechaInhumacion: requisitoInhumacion.fechaInhumacion,
          horaInhumacion: requisitoInhumacion.horaInhumacion,
          nombreAdministradorNicho:
            requisitoInhumacion.nombreAdministradorNicho,
          observacionCertificadoDefuncion:
            requisitoInhumacion.observacionCertificadoDefuncion || "",
          observacionInformeEstadisticoINEC:
            requisitoInhumacion.observacionInformeEstadisticoINEC || "",
          observacionCopiaCedula:
            requisitoInhumacion.observacionCopiaCedula || "",
          observacionPagoTasaInhumacion:
            requisitoInhumacion.observacionPagoTasaInhumacion || "",
          observacionCopiaTituloPropiedadNicho:
            requisitoInhumacion.observacionCopiaTituloPropiedadNicho || "",
          observacionOficioSolicitud:
            requisitoInhumacion.observacionOficioSolicitud || "",
          observacionAutorizacionMovilizacion:
            requisitoInhumacion.observacionAutorizacionMovilizacion || "",
        }
      : {},
  });

  const { mutate: create, isPending: isCreating } =
    useCreateRequisitoInhumacionMutation();
  const { mutate: update, isPending: isUpdating } =
    useUpdateRequisitoInhumacionMutation();
  const { mutate: downloadRequisitoPdf } = useDownloadRequisitoInhumacionPdfMutation();

  const http = AxiosClient.getInstance();

  const resolveInhumacionIdByFallecido = async (
    idFallecido?: string
  ): Promise<string | null> => {
    try {
      if (!idFallecido) return null;
      // 1) Obtener cédula del fallecido
      const personaResp = await http.get<any>(
        API_ROUTES.PERSONS.GET_BY_ID(idFallecido)
      );
      const cedula: string | undefined = personaResp?.data?.data?.cedula;
      if (!cedula) return null;
      // 2) Buscar inhumaciones por cédula (usar respuesta cruda)
      const inhResp = await http.get<any>(
        API_ROUTES.INHUMACIONES.SEARCH_FALLECIDOS(cedula)
      );
      const payload = inhResp?.data?.data;
      // Intentar navegar estructura conocida: { fallecidos: [ { inhumaciones: [...] } ] }
      const first = Array.isArray(payload?.fallecidos)
        ? payload.fallecidos[0]
        : null;
      const inhs =
        first?.inhumaciones ||
        first?.persona?.inhumaciones ||
        payload?.inhumaciones ||
        [];
      if (Array.isArray(inhs) && inhs.length > 0) {
        const id =
          inhs[0]?.id_inhumacion || inhs[0]?.idInhumacion || inhs[0]?.id;
        return id || null;
      }
      return null;
    } catch (e) {
      console.warn("No se pudo resolver id_inhumacion:", e);
      return null;
    }
  };

  const getCedulaByFallecidoId = async (
    idFallecido?: string
  ): Promise<string | null> => {
    try {
      if (!idFallecido) return null;
      const personaResp = await http.get<any>(
        API_ROUTES.PERSONS.GET_BY_ID(idFallecido)
      );
      return personaResp?.data?.data?.cedula || null;
    } catch {
      return null;
    }
  };

  const uploadSolicitudFirmadaIfNeeded = async (
    selectedDocument: File | undefined,
    requisitoIdOrIdFallecido?: string,
    maybeIdFallecido?: string
  ): Promise<boolean> => {
    try {
      if (!selectedDocument) return false;
      const repo = RequisitoInhumacionRepositoryImpl.getInstance();

      // If caller passed a requisitoId (result from create/update), upload directly to requisitos-inhumacion endpoint
      if (requisitoIdOrIdFallecido) {
        try {
          console.log(
            "[upload] Intentando subir documento consolidado al requisitoId=",
            requisitoIdOrIdFallecido
          );
          const resp = await repo.uploadConsolidatedDocumentForRequisito(
            requisitoIdOrIdFallecido,
            selectedDocument
          );
          console.log(
            "[upload] Respuesta subida documento consolidado:",
            resp?.status,
            resp?.data
          );
          toast.success("Documento subido correctamente");
          return true;
        } catch (err) {
          console.warn(
            "[upload] Fallback: no se pudo subir al endpoint de requisito:",
            err
          );
          // continue to fallback below
        }
      }

      // Fallback: try resolving inhumacion id by fallecido
      const idFallecido = maybeIdFallecido || requisitoIdOrIdFallecido;
      const inhumacionId = await resolveInhumacionIdByFallecido(idFallecido);
      console.log(
        "[upload] idFallecido=",
        idFallecido,
        " -> inhumacionId=",
        inhumacionId
      );
      if (!inhumacionId) {
        console.warn(
          "[upload] No se pudo resolver id_inhumacion; se omite subida"
        );
        toast.warning(
          "No se pudo resolver la inhumación para subir el documento"
        );
        return false;
      }
      const resp = await repo.uploadDocuments(inhumacionId, {
        solicitud_firmada: selectedDocument,
      });
      console.log(
        "[upload] Respuesta subida documentos:",
        resp?.status,
        resp?.data
      );
      toast.success("Documento subido correctamente");
      return true;
    } catch (e) {
      console.warn("[upload] Fallo al subir solicitud_firmada:", e);
      toast.error("Error al subir el documento");
      return false;
    }
  };

  const onSubmit = async (
    data: CreateRequisitoInhumacionDTO,
    selectedDocument?: File
  ) => {
    console.log("Submitting requisito inhumacion data:", data);

    // Decide whether we are updating or creating. Accept both possible id property names.
    const requisitoAny = requisitoInhumacion as any;
    const hasExistingId = !!(
      requisitoAny &&
      (requisitoAny.idRequsitoInhumacion || requisitoAny.idRequisitoInhumacion)
    );

    if (hasExistingId) {
      // prefer the existing id value (support both spellings)
      const existingId =
        requisitoAny?.idRequsitoInhumacion ??
        requisitoAny?.idRequisitoInhumacion;
      update(
        {
          idRequisitoInhumacion: existingId as string,
          ...data,
        },
        {
          onSuccess: async (result) => {
            console.log("Actualización exitosa");
            // Upload document (prefer uploading to the requisito endpoint)
            await uploadSolicitudFirmadaIfNeeded(
              selectedDocument,
              existingId as string,
              data.idFallecido
            );

            // Normalize result id
            const resultAny = result as any;
            const requisitoId =
              resultAny?.idRequsitoInhumacion ??
              resultAny?.idRequisitoInhumacion ??
              resultAny?.id ?? existingId;

            // Trigger a single download directly here (avoid relying on URL param)
            if (requisitoId) {
              try {
                downloadRequisitoPdf(requisitoId);
              } catch (e) {
                console.warn("Error triggering download:", e);
              }
            }

            const cedula = await getCedulaByFallecidoId(data.idFallecido);
            router.push(cedula ? `/requisitos-inhumacion?q=${encodeURIComponent(cedula)}` : `/requisitos-inhumacion`);
          },
          onError: (error) => {
            console.error("Error en actualización:", error);
          },
        }
      );
    } else {
      // Attempt to create the related Inhumación before creating the requisito so codigoInhumacion and estado are persisted
      try {
        // Resolve idNicho from selected hueco (idHuecoNicho is an idDetalleHueco)
        let idNicho: string | undefined;
        if (data.idHuecoNicho) {
          try {
            const huecoResp = await http.get<any>(
              API_ROUTES.HUECOS.GET_BY_ID(data.idHuecoNicho)
            );
            idNicho = huecoResp?.data?.data?.id_nicho || undefined;
          } catch (e) {
            console.warn("No se pudo obtener id_nicho desde hueco:", e);
          }
        }

        // Resolve solicitante name from idSolicitante (person)
        let solicitanteName = "";
        if (data.idSolicitante) {
          try {
            const personResp = await http.get<any>(
              API_ROUTES.PERSONS.GET_BY_ID(data.idSolicitante)
            );
            const p = personResp?.data?.data;
            if (p) solicitanteName = `${p.nombres || ""} ${p.apellidos || ""}`.trim();
          } catch (e) {
            console.warn("No se pudo obtener solicitante:", e);
          }
        }

        if (
          idNicho &&
          data.idFallecido &&
          data.fechaInhumacion &&
          data.horaInhumacion &&
          data.codigoInhumacion
        ) {
          try {
            const inhumRepo = InhumacionRepositoryImpl.getInstance();
            const inhumPayload = {
              idNicho: idNicho,
              idFallecido: data.idFallecido,
              fechaInhumacion: data.fechaInhumacion,
              horaInhumacion: data.horaInhumacion,
              solicitante: solicitanteName || data.idSolicitante || "",
              responsableInhumacion: solicitanteName || "",
              observaciones: data.observacionSolicitante || undefined,
              estado: "Pendiente",
              codigoInhumacion: data.codigoInhumacion,
            } as any;

            console.log("Creando inhumación previa al requisito:", inhumPayload);
            await inhumRepo.create(inhumPayload);
            toast.success("Inhumación creada correctamente");
          } catch (e) {
            console.warn("Fallo al crear la inhumación previa:", e);
            toast.warning(
              "No se pudo crear la inhumación automáticamente. Se continuará creando el requisito."
            );
          }
        } else {
          console.warn(
            "Datos insuficientes para crear inhumación previa, se omitirá creación automática."
          );
        }
      } catch (e) {
        console.warn("Error en flujo de creación previa de inhumación:", e);
      }

      create(data, {
        onSuccess: async (result) => {
          console.log("Creación exitosa - result:", result);
          // normalize id returned by backend: try multiple fields
          const resultAny = result as any;
          const requisitoId =
            resultAny?.idRequsitoInhumacion ??
            resultAny?.idRequisitoInhumacion ??
            resultAny?.id;

          console.log("[upload] resolved requisitoId:", requisitoId);

          // Upload document preferring requisito endpoint
          await uploadSolicitudFirmadaIfNeeded(
            selectedDocument,
            requisitoId,
            data.idFallecido
          );

          // Trigger download once (if we have an id)
          if (requisitoId) {
            try {
              downloadRequisitoPdf(requisitoId);
            } catch (e) {
              console.warn("Error triggering download after create:", e);
            }
          }

          const cedula = await getCedulaByFallecidoId(data.idFallecido);
          router.push(cedula ? `/requisitos-inhumacion?q=${encodeURIComponent(cedula)}` : "/requisitos-inhumacion");
        },
        onError: async (error) => {
          console.error("Error en creación:", error);
          // If backend reports that the requisito already exists, attempt to locate it and attach the document
          try {
            const axiosErr = error as AxiosError;
            const status = axiosErr?.response?.status;
            const message = (axiosErr?.response?.data as any)?.message || axiosErr?.message || "";

            const alreadyExists =
              status === 409 || /existe|already exists|ya existe/i.test(String(message));

            if (alreadyExists) {
              toast.warning("Ya existe un requisito para esta inhumación. Intentando localizar el requisito existente...");

              // Try to resolve via cedula
              const cedula = await getCedulaByFallecidoId(data.idFallecido);
              if (cedula) {
                try {
                  // Use repository search to find existing requisitos for this cedula
                  const repo = RequisitoInhumacionRepositoryImpl.getInstance();
                  const searchResp = await repo.searchFallecidos(cedula);
                  // searchResp has structure mapped to entity; try to find a requisito that matches hueco/fallecido
                  const found = (searchResp.fallecidos || [])
                    .flatMap((f: any) => f.requisitos || [])
                    .find((r: any) => {
                      // match by id_fallecido or by hueco/nicho if provided
                      if (!r) return false;
                      const sameFallecido = (r.id_fallecido?.id_persona || r.idFallecido?.id_persona || r.idFallecido?.id_persona) === data.idFallecido;
                      return sameFallecido;
                    });

                  const existingId = found?.id_requsitoInhumacion || found?.idRequsitoInhumacion || found?.idRequisitoInhumacion || found?.id;
                  if (existingId) {
                    toast.success("Se encontró requisito existente. Subiendo documento y abriendo registro...");
                    // upload document if provided
                    if (selectedDocument) {
                      try {
                        await uploadSolicitudFirmadaIfNeeded(selectedDocument, existingId, data.idFallecido);
                      } catch (e) {
                        console.warn("Fallo al subir documento al requisito existente:", e);
                      }
                    }
                    // Navigate to the list filtered by cedula
                    router.push(`/requisitos-inhumacion?q=${encodeURIComponent(cedula)}`);
                    return;
                  }
                } catch (e) {
                  console.warn("Error buscando requisito existente:", e);
                }
              }

              // If we couldn't find it, show info to user
              toast.error("No se pudo localizar el requisito existente automáticamente. Por favor revisa en la lista.");
            }
          } catch (e) {
            console.warn("Error handling create onError fallback:", e);
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
