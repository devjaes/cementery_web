"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";

const MAX_FILE_COUNT = 6;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

type PreviewCard = {
  id: string;
  name: string;
  size: number;
  url: string;
};

type MejoraDocumentUploadProps = {
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
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
  disabled = false,
}: MejoraDocumentUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<PreviewCard[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(event.target.files ?? []);
    const pdfFiles = rawFiles.filter((file) => {
      const isPdfMime = file.type === "application/pdf";
      const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
      return isPdfMime || hasPdfExtension;
    });

    const nextFiles = pdfFiles.slice(0, MAX_FILE_COUNT);
    if (pdfFiles.length > MAX_FILE_COUNT) {
      setError(`Selecciona máximo ${MAX_FILE_COUNT} archivos PDF`);
    } else if (rawFiles.length !== pdfFiles.length) {
      setError("Solo se permiten archivos PDF");
    } else {
      setError(null);
    }

    onFilesChange(nextFiles);
    event.target.value = "";
  };

  useEffect(() => {
    const data: PreviewCard[] = selectedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setPreviews(data);
    return () => {
      data.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [selectedFiles]);

  const remainingSlots = useMemo(() => MAX_FILE_COUNT - selectedFiles.length, [selectedFiles.length]);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="mejora-documentos">
          Documentación requerida
        </label>
        <p className="text-xs text-muted-foreground">
          Puedes subir hasta {MAX_FILE_COUNT} archivos PDF ({formatBytes(MAX_FILE_SIZE_BYTES)} máximo por archivo).
        </p>
      </div>
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
        <p className="text-xs text-destructive">Ya alcanzaste el límite de {MAX_FILE_COUNT} archivos.</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          {previews.map((preview) => (
            <div key={preview.id} className="rounded-lg border bg-white/80 p-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{preview.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(preview.size)}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => window.open(preview.url, "_blank")}>
                  Abrir PDF
                </Button>
              </div>
              <div className="mt-3 hidden md:block h-52 w-full overflow-hidden rounded border">
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
