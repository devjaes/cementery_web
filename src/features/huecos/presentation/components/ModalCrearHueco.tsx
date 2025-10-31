"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

interface ModalCrearHuecoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { file: File; observacion: string }) => void;
  isLoading?: boolean;
}

export function ModalCrearHueco({ open, onClose, onConfirm, isLoading }: ModalCrearHuecoProps) {
  const [file, setFile] = useState<File | null>(null);
  const [observacion, setObservacion] = useState("");

  const handleSubmit = () => {
    if (!file) {
      alert("Por favor selecciona un PDF");
      return;
    }
    // Logs de depuración
    console.log("[ModalCrearHueco] Archivo seleccionado:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    console.log("[ModalCrearHueco] Observación:", observacion);
    onConfirm({ file, observacion });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Hueco</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">PDF de autorización</label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <label className="text-sm font-medium">Observación</label>
          <Textarea
            placeholder="Escribe una observación..."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
