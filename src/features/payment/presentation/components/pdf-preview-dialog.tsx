"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Download, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { PaymentEntity } from "../../domain/entities/payment.entity";

interface PdfPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfBlob: Blob | null;
  payment: PaymentEntity | null;
  autoPreview?: boolean;
}

export function PdfPreviewDialog({
  open,
  onOpenChange,
  pdfBlob,
  payment,
  autoPreview = true,
}: PdfPreviewDialogProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(autoPreview);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfBlob]);

  useEffect(() => {
    setShowPreview(autoPreview);
  }, [autoPreview]);

  const handleDownload = () => {
    if (pdfUrl && payment) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `comprobante-pago-${payment.paymentCode}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl h-[90vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Comprobante de Pago Generado</span>
            <div className="flex gap-2">
              {!autoPreview && !showPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  disabled={!pdfUrl}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Preview
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!pdfUrl}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Visualiza y descarga el comprobante de pago generado
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50">
          {showPreview ? (
            pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="Vista previa del comprobante de pago"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Cargando vista previa...
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <FileText className="w-16 h-16 text-muted-foreground" />
              <p className="text-muted-foreground">
                Haga clic en &quot;Ver Preview&quot; para visualizar el
                documento
              </p>
              <Button onClick={handlePreview} disabled={!pdfUrl}>
                <FileText className="w-4 h-4 mr-2" />
                Ver Preview
              </Button>
            </div>
          )}
        </div>

        {payment && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Código de Pago:{" "}
              <span className="font-bold">{payment.paymentCode}</span>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Monto:{" "}
              <span className="font-semibold">
                ${Number(payment.amount).toFixed(2)}
              </span>
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Este comprobante debe ser presentado para realizar el pago
              correspondiente.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
