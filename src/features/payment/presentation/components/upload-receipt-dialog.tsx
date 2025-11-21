"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Upload, Loader2, FileCheck } from "lucide-react";
import { useUploadReceipt } from "../hooks/use-payment-mutation";

interface UploadReceiptDialogProps {
  paymentId: string;
  validatedBy: string;
  onSuccess?: () => void;
  triggerLabel?: string; // Texto del botón disparador (por defecto: "Subir Comprobante")
  triggerVariant?: "default" | "secondary" | "destructive" | "outline"; // variante visual
}

export const UploadReceiptDialog = ({
  paymentId,
  validatedBy,
  onSuccess,
  triggerLabel = "Subir Comprobante",
  triggerVariant = "default",
}: UploadReceiptDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadReceipt = useUploadReceipt();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadReceipt.mutate(
      {
        paymentId,
        file: selectedFile,
        validatedBy,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedFile(null);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className="gap-2">
          <Upload className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir Comprobante de Pago</DialogTitle>
          <DialogDescription>
            Sube el comprobante de pago escaneado. Al subirlo, el pago será confirmado automáticamente.
          </DialogDescription>
        </DialogHeader> 

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receipt-file">Archivo del Comprobante</Label>
            <Input
              id="receipt-file"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              disabled={uploadReceipt.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Formatos aceptados: JPG, PNG, PDF (máx. 5MB)
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 text-sm">
              <FileCheck className="h-4 w-4 text-green-600" />
              <span>{selectedFile.name}</span>
              <span className="text-muted-foreground">
                ({(selectedFile.size / 1024).toFixed(2)} KB)
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSelectedFile(null);
            }}
            disabled={uploadReceipt.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadReceipt.isPending}
          >
            {uploadReceipt.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Subir y Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
