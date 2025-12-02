"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Eye, Trash } from "lucide-react";
import { MejoraDocumento } from "../../domain/entities/mejora.entity";

const MAX_FILE_COUNT = 6;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const DOCUMENT_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "").replace(/\/$/, "");
const buildDocumentUrl = (relative?: string) => (relative ? `${DOCUMENT_BASE_URL}${relative}` : relative);

type PreviewCard = {
  id: string;
  name: string;
  size: number;
  url: string;
};

type MejoraDocumentUploadProps = {
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
  existingDocuments?: MejoraDocumento[];
  onRemoveDocument?: (doc: MejoraDocumento) => void;
  removingDocument?: string | null;
  disabled?: boolean;
};

const formatBytes = (value: number) => {
  if (value === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.floor(Math.log(value) / Math.log(1024));
  const formatted = (value / Math.pow(1024, exponent)).toFixed(1);
  return `${formatted} ${units[exponent]}`;
};

export default function MejoraDocumentUpload({
  selectedFiles,
  onFilesChange,
  existingDocuments,
  onRemoveDocument,
  removingDocument,
  disabled = false,
}: MejoraDocumentUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<PreviewCard[]>([]);

  const existingCount = existingDocuments?.length ?? 0;
  const selectedCount = selectedFiles.length;
  const remainingSlots = useMemo(
    () => Math.max(0, MAX_FILE_COUNT - existingCount - selectedCount),
    [existingCount, selectedCount],
  );

  const buildSelectedFileId = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(event.target.files ?? []);
    const pdfFiles = rawFiles.filter((file) => {
      const isPdfMime = file.type === "application/pdf";
      const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
      return isPdfMime || hasPdfExtension;
    });

    if (rawFiles.length !== pdfFiles.length) {
      setError("Solo se permiten archivos PDF");
    } else {
      setError(null);
    }

    if (remainingSlots === 0) {
      setError(`Solo puedes guardar ${MAX_FILE_COUNT} archivos como máximo.`);
      event.target.value = "";
      return;
    }

    const allowed = pdfFiles.slice(0, remainingSlots);

    if (allowed.length < pdfFiles.length) {
      setError(`Puedes añadir hasta ${remainingSlots} archivo(s) más.`);
    }

    onFilesChange(allowed);
    event.target.value = "";
  };

  const handleRemoveSelectedFile = (id: string) => {
    onFilesChange(selectedFiles.filter((file) => buildSelectedFileId(file) !== id));
  };

  useEffect(() => {
    const data: PreviewCard[] = selectedFiles.map((file) => ({
      id: buildSelectedFileId(file),
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setPreviews(data);
    return () => {
      data.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [selectedFiles]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="mejora-documentos">
          Documentación requerida
        </label>
        <p className="text-xs text-muted-foreground">
          Puedes subir hasta {MAX_FILE_COUNT} archivos PDF ({formatBytes(MAX_FILE_SIZE_BYTES)} máximo por archivo).
        </p>
      </div>

      {existingDocuments && existingDocuments.length > 0 && (
        <div className="space-y-3">
          <Alert variant="destructive" className="p-3 text-sm">
            <AlertTitle>Advertencia</AlertTitle>
            <AlertDescription>
              Eliminar un documento desaparecerá del respaldo en el servidor. Asegúrate de que no lo necesites de nuevo.
            </AlertDescription>
          </Alert>
          <div className="space-y-3">
            {existingDocuments.map((doc) => (
              <div key={doc.filename} className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-200 bg-white/80 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doc.originalName}</p>
                    <p className="text-xs text-muted-foreground">
                      Subido el {new Date(doc.uploadedAt).toLocaleString()} · {formatBytes(doc.size)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(buildDocumentUrl(doc.url), "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                    {onRemoveDocument ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        disabled={removingDocument === doc.filename}
                        onClick={() => onRemoveDocument(doc)}
                      >
                        {removingDocument === doc.filename ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                        Eliminar
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        id="mejora-documentos"
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleChange}
        className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white disabled:cursor-not-allowed"
        disabled={disabled || remainingSlots <= 0}
      />
      {remainingSlots <= 0 && (
        <p className="text-xs text-destructive">
          Ya alcanzaste el límite de {MAX_FILE_COUNT} archivos. Elimina uno existente para agregar otro.
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          {previews.map((preview) => (
            <div key={preview.id} className="rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{preview.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(preview.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => window.open(preview.url, "_blank")}
                  >
                    <Eye className="h-4 w-4" />
                    Abrir PDF
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleRemoveSelectedFile(preview.id)}
                  >
                    <Trash className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
              <div className="mt-3 hidden h-52 w-full overflow-hidden rounded border bg-slate-50 md:block">
                <iframe
                  title={`Vista previa ${preview.name}`}
                  src={preview.url}
                  className="h-full w-full"
                  aria-label={`Vista previa del documento ${preview.name}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
