import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateMejoraEntity, MejoraEntity } from "../../domain/entities/mejora.entity";
import { MejoraRepositoryImpl } from "../../infraestructure/repositories/mejora.repository.impl";

const KEYS = {
  all: () => ["mejoras"] as const,
  byId: (id: string) => ["mejoras", id] as const,
};

export const useCreateMejoraMutation = () => {
  const qc = useQueryClient();
  return useMutation<MejoraEntity, Error, CreateMejoraEntity>({
    mutationFn: (data) => MejoraRepositoryImpl.getInstance().create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all() });
      toast.success("Solicitud de mejoras creada correctamente");
    },
    onError: (e) => toast.error("Error al crear la solicitud de mejoras", { description: e.message }),
  });
};

export const useUploadMejoraFilesMutation = () => {
  return useMutation<void, Error, { id: string; files: File[] }>({
    mutationFn: ({ id, files }) => MejoraRepositoryImpl.getInstance().uploadFiles(id, files),
  });
};

export const useApproveMejoraMutation = () => {
  const qc = useQueryClient();
  return useMutation<MejoraEntity, Error, { id: string; aprobadoPorId: string }>({
    mutationFn: ({ id, aprobadoPorId }) =>
      MejoraRepositoryImpl.getInstance().approve(id, { aprobadoPorId }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: KEYS.all() });
      qc.invalidateQueries({ queryKey: KEYS.byId(variables.id) });
      toast.success("Mejora aprobada", {
        description: "La solicitud cambió su estado a Aprobado.",
      });
    },
    onError: (error) => {
      toast.error("No se pudo aprobar la mejora", {
        description: error.message,
      });
    },
  });
};

export const useDownloadMejoraPdfMutation = () => {
  const qc = useQueryClient();
  return useMutation<{ blob: Blob; filename?: string; contentType?: string }, Error, { id: string }>(
    {
      mutationFn: ({ id }) => MejoraRepositoryImpl.getInstance().downloadPdf(id),
      onSuccess: async ({ blob, filename: providedFilename, contentType }, { id }) => {
        if (!blob || blob.size === 0) {
          toast.error("El archivo descargado está vacío", {
            description: "No se pudo generar el formulario de la mejora.",
          });
          return;
        }

        let mejora = qc.getQueryData<MejoraEntity>(KEYS.byId(id));

        if (!mejora) {
          try {
            mejora = await MejoraRepositoryImpl.getInstance().findById(id);
          } catch (error) {
            console.warn("No se pudo obtener la mejora desde la cache ni desde la API", error);
          }
        }

  const reference = providedFilename ?? `mejora_${mejora?.codigoAutorizacion ?? id}`;
        const normalized = reference.replace(/[^a-zA-Z0-9-_.]/g, "_");
        const filename = normalized.toLowerCase().endsWith(".pdf") ? normalized : `${normalized}.pdf`;

        const finalType = contentType ?? (blob.type || "application/pdf");
        const normalizedBlob = blob.type && blob.type !== "application/octet-stream"
          ? blob
          : blob.slice(0, blob.size, finalType);

        if (!(finalType ?? "").toLowerCase().includes("pdf")) {
          try {
            const message = await normalizedBlob.text();
            toast.error("No se pudo generar el formulario de la mejora", {
              description: message.slice(0, 1200),
            });
          } catch (_error) {
            toast.error("No se pudo generar el formulario de la mejora");
          }
          return;
        }

        const url = window.URL.createObjectURL(normalizedBlob);
        const previewWindow = window.open(url, "_blank", "noopener,noreferrer");

        if (!previewWindow) {
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Formulario descargado", {
            description: "El navegador bloqueó la vista previa, se descargó el PDF.",
          });
        } else {
          previewWindow.focus();
          toast.success("Formulario listo", {
            description: "La vista previa del PDF se abrió en una nueva pestaña.",
          });
        }

        const revoke = () => {
          window.URL.revokeObjectURL(url);
          window.removeEventListener("pagehide", revoke);
          window.removeEventListener("beforeunload", revoke);
        };

        window.addEventListener("pagehide", revoke, { once: true });
        window.addEventListener("beforeunload", revoke, { once: true });
        setTimeout(revoke, 60000);
      },
      onError: (error) => {
        toast.error("No se pudo descargar el formulario de la mejora", {
          description: error.message,
        });
      },
    }
  );
};


